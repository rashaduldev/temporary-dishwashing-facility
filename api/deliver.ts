import { timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "../server/types.js";
import { firebase, requiredSecret } from "../server/firebase.js";
import { deliverLead } from "../server/store.js";
import { HttpError } from "../server/contact.js";
import { secure, fail } from "../server/http.js";
export const config = { maxDuration: 60 };
export default async function handler(req: VercelRequest, res: VercelResponse) {
  secure(res);
  try {
    if (req.method !== "POST") throw new HttpError(405, "Use POST.");
    const expected = Buffer.from(`Bearer ${requiredSecret("CRON_SECRET")}`);
    const auth = req.headers.authorization;
    const received = Buffer.from(typeof auth === "string" ? auth : "");
    if (
      received.length !== expected.length ||
      !timingSafeEqual(received, expected)
    )
      throw new HttpError(401, "Unauthorized.");
    const { db } = firebase();
    const docs = await db
      .ref("inquiries")
      .orderByChild("status")
      .equalTo("queued")
      .limitToFirst(5)
      .get();
    let delivered = 0;
    for (const id of Object.keys(docs.val() || {}))
      if (await deliverLead(id)) delivered++;
    let removed = 0;
    for (const root of ["inquiries", "rateLimits"]) {
      const expired = await db
        .ref(root)
        .orderByChild("expiresAt")
        .endAt(Date.now())
        .limitToFirst(100)
        .get();
      const updates: Record<string, null> = {};
      expired.forEach((s) => {
        updates[s.key!] = null;
        removed++;
      });
      if (Object.keys(updates).length) await db.ref(root).update(updates);
    }
    return res
      .status(200)
      .json({ examined: docs.numChildren(), delivered, removed });
  } catch (e) {
    return fail(res, e);
  }
}
