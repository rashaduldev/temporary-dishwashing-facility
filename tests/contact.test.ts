import { describe, it, expect, vi } from "vitest";
import { submit, type Deps } from "../server/contact";
const lead = {
  name: "Test Person",
  email: "test@example.com",
  phone: "+1 555 010 2000",
  startDate: "2026-10-01",
  location: "Test site",
  service: "mobile-kitchens",
  duration: "1-3-months",
  industry: "construction",
  message: "A synthetic project inquiry for tests.",
  consent: true,
  website: "",
  page: "/contact/",
};
const req = () => ({
  method: "POST",
  headers: {
    origin: "https://april.test",
    "content-type": "application/json",
    "x-vercel-forwarded-for": "192.0.2.1",
    "x-firebase-appcheck": "test-token",
    "idempotency-key": "8116e91d-8881-4475-8f1b-1e177f47ca01",
  },
  body: JSON.stringify(lead),
});
const deps = (): Deps => ({
  enabled: true,
  origins: ["https://april.test"],
  verify: vi.fn(async () => {}),
  limit: vi.fn(async () => {}),
  save: vi.fn(async () => "test-id"),
  deliver: vi.fn(async () => {}),
});
describe("contact application boundary", () => {
  it("saves before email and returns a persisted success", async () => {
    const d = deps();
    expect((await submit(req(), d)).status).toBe(201);
    expect(d.save).toHaveBeenCalledOnce();
    expect(d.deliver).toHaveBeenCalledWith("test-id");
  });
  it.each([
    ["GET", 405],
    ["DELETE", 405],
  ])("rejects %s", async (method, status) => {
    const d = deps();
    await expect(submit({ ...req(), method }, d)).rejects.toMatchObject({
      status,
    });
    expect(d.save).not.toHaveBeenCalled();
  });
  it("rejects disabled configuration", async () => {
    await expect(
      submit(req(), { ...deps(), enabled: false }),
    ).rejects.toMatchObject({ status: 503 });
  });
  it.each([
    "https://attacker.test",
    "null",
    "https://april.test.attacker.test",
  ])("rejects origin %s", async (origin) => {
    const r = req();
    r.headers.origin = origin;
    const d = deps();
    await expect(submit(r, d)).rejects.toMatchObject({ status: 403 });
    expect(d.save).not.toHaveBeenCalled();
  });
  it("rejects a forged role", async () => {
    await expect(
      submit(
        { ...req(), body: JSON.stringify({ ...lead, role: "admin" }) },
        deps(),
      ),
    ).rejects.toMatchObject({ status: 400 });
  });
  it("rejects honeypot spam", async () => {
    await expect(
      submit(
        { ...req(), body: JSON.stringify({ ...lead, website: "spam" }) },
        deps(),
      ),
    ).rejects.toMatchObject({ status: 400 });
  });
  it("rejects oversized bodies", async () => {
    await expect(
      submit({ ...req(), body: "x".repeat(9000) }, deps()),
    ).rejects.toMatchObject({ status: 413 });
  });
  it("rejects invalid JSON", async () => {
    await expect(submit({ ...req(), body: "{" }, deps())).rejects.toMatchObject(
      { status: 400 },
    );
  });
  it("rejects arbitrary forwarding header replacement", async () => {
    const r = req();
    r.headers["x-vercel-forwarded-for"] = "";
    await expect(submit(r, deps())).rejects.toMatchObject({ status: 503 });
  });
  it("rejects unverified App Check", async () => {
    const d = deps();
    d.verify = vi.fn(async () => {
      throw Error();
    });
    await expect(submit(req(), d)).rejects.toMatchObject({ status: 403 });
    expect(d.save).not.toHaveBeenCalled();
  });
  it("does not save when the limiter fails", async () => {
    const d = deps();
    d.limit = vi.fn(async () => {
      throw Error();
    });
    await expect(submit(req(), d)).rejects.toThrow();
    expect(d.save).not.toHaveBeenCalled();
  });
  it("preserves stored success when email fails", async () => {
    const d = deps();
    d.deliver = vi.fn(async () => {
      throw Error();
    });
    expect((await submit(req(), d)).status).toBe(201);
  });
  it("never sends when storage fails", async () => {
    const d = deps();
    d.save = vi.fn(async () => {
      throw Error();
    });
    await expect(submit(req(), d)).rejects.toThrow();
    expect(d.deliver).not.toHaveBeenCalled();
  });
});
