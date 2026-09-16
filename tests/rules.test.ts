import { beforeAll, afterAll, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { initializeApp, deleteApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { rateLimit, saveLead } from "../server/store";
import { processDelivery } from "../server/delivery";
let env: RulesTestEnvironment;
const projectId = "demo-temporary123",
  url = `https://${projectId}-default-rtdb.firebaseio.com`;
const app = initializeApp({ projectId, databaseURL: url }, "test-rtdb"),
  db = getDatabase(app);
beforeAll(async () => {
  if (process.env.FIREBASE_DATABASE_EMULATOR_HOST !== "127.0.0.1:9000")
    throw Error("Refusing non-emulator target");
  process.env.RATE_LIMIT_SECRET = "synthetic-emulator-secret-only-32-bytes";
  env = await initializeTestEnvironment({
    projectId,
    database: {
      host: "127.0.0.1",
      port: 9000,
      rules: readFileSync("database.rules.json", "utf8"),
    },
  });
  await db.ref().set(null);
});
afterAll(async () => {
  await env?.cleanup();
  await deleteApp(app);
});
it.each(["anonymous", "owner", "other"])(
  "denies direct private reads and writes for %s",
  async (actor) => {
    const client = (
      actor === "anonymous"
        ? env.unauthenticatedContext()
        : env.authenticatedContext(actor)
    ).database(url);
    for (const p of ["", "inquiries/test", "rateLimits/test", "unknown/test"]) {
      await assertFails(client.ref(p || undefined).once("value"));
      await assertFails(client.ref(p || undefined).set({ admin: true }));
      await assertFails(client.ref(p || undefined).remove());
    }
  },
);
it("atomically caps concurrent IP requests", async () => {
  const result = await Promise.allSettled(
    Array.from({ length: 10 }, () => rateLimit(db, "192.0.2.1", 1800000)),
  );
  expect(result.filter((r) => r.status === "fulfilled")).toHaveLength(5);
  expect(result.filter((r) => r.status === "rejected")).toHaveLength(5);
  await expect(rateLimit(db, "192.0.2.1", 2700000)).resolves.toBeUndefined();
});
const data = {
  name: "Test User",
  email: "test@example.invalid",
  phone: "+1 555 010 2000",
  startDate: "2026-10-01",
  location: "Test site",
  service: "mobile-kitchens" as const,
  duration: "1-3-months" as const,
  industry: "construction" as const,
  message: "Synthetic test inquiry only.",
  consent: true as const,
  website: "",
  page: "/contact/" as const,
};
it("atomically deduplicates submissions and rejects changed payloads", async () => {
  const ids = await Promise.all(
    Array.from({ length: 8 }, () => saveLead(db, "same-key", data)),
  );
  expect(new Set(ids).size).toBe(1);
  await expect(
    saveLead(db, "same-key", { ...data, name: "Changed name" }),
  ).rejects.toMatchObject({ status: 409 });
  expect((await db.ref("inquiries/" + ids[0]).get()).val().status).toBe(
    "queued",
  );
});
it("only one delivery worker sends and persists provider result", async () => {
  const id = await saveLead(db, "delivery-key", data);
  let calls = 0;
  const deps = {
    db,
    createMessage: () => ({
      from: "test@example.invalid",
      to: ["test@example.invalid"],
      text: "Synthetic test only",
      subject: "Test",
    }),
    send: async () => {
      calls++;
      return "synthetic-provider-id";
    },
  };
  await Promise.all(Array.from({ length: 6 }, () => processDelivery(id, deps)));
  expect(calls).toBe(1);
  expect((await db.ref("inquiries/" + id).get()).val().status).toBe("sent");
});
it("retains failed messages and stops retries before provider deduplication expires", async () => {
  const id = await saveLead(db, "failure-key", data);
  const deps = {
    db,
    createMessage: () => ({
      from: "test@example.invalid",
      to: ["test@example.invalid"],
      text: "Synthetic",
      subject: "Test",
    }),
    send: async () => {
      throw Error("offline");
    },
  };
  await expect(processDelivery(id, deps)).rejects.toThrow();
  expect((await db.ref("inquiries/" + id).get()).val().leaseUntil).toBe(0);
  await processDelivery(id, { ...deps, now: () => Date.now() + 24 * 3600000 });
  expect((await db.ref("inquiries/" + id).get()).val().status).toBe(
    "manual_review",
  );
});
