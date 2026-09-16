import { createHmac } from "node:crypto";
import type { Database } from "firebase-admin/database";
import { Resend } from "resend";
import { firebase, required, requiredSecret } from "./firebase.js";
import { processDelivery } from "./delivery.js";
import site from "../site.json" with { type: "json" };
import { HttpError } from "./contact.js";
import type { Lead } from "./schema.js";
export const digest = (text: string) =>
  createHmac("sha256", requiredSecret("RATE_LIMIT_SECRET"))
    .update(text)
    .digest("hex");
export async function rateLimit(db: Database, ip: string, now = Date.now()) {
  const window = Math.floor(now / 900000),
    key = digest(ip);
  try {
    const result = await db
      .ref(`rateLimits/${window}`)
      .transaction((current) => {
        const value = current || {
          count: 0,
          ips: {},
          expiresAt: (window + 1) * 900000 + 86400000,
        };
        if (value.count >= 100 || (value.ips?.[key] || 0) >= 5) return;
        return {
          ...value,
          count: value.count + 1,
          ips: { ...value.ips, [key]: (value.ips?.[key] || 0) + 1 },
        };
      });
    if (!result.committed)
      throw new HttpError(
        429,
        "Too many inquiries. Please try again later.",
        Math.ceil(((window + 1) * 900000 - now) / 1000),
      );
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(
      503,
      "Inquiries are temporarily unavailable. Please retry later.",
    );
  }
}
export async function saveLead(db: Database, key: string, data: Lead) {
  const id = digest("inquiry:" + key),
    payloadHash = digest(JSON.stringify(data)),
    now = Date.now();
  const result = await db.ref("inquiries/" + id).transaction(
    (current) =>
      current || {
        data,
        payloadHash,
        createdAt: now,
        expiresAt: now + 90 * 86400000,
        status: "queued",
      },
  );
  if (result.snapshot.val()?.payloadHash !== payloadHash)
    throw new HttpError(
      409,
      "This request identifier was already used. Refresh the form.",
    );
  return id;
}
export async function deliverLead(id: string) {
  const { db } = firebase();
  return processDelivery(id, {
    db,
    createMessage: (record, id) => {
      const data = record.data as Lead;
      return {
        from: required("RESEND_FROM"),
        to: [required("LEADS_TO_EMAIL")],
        replyTo: data.email,
        subject: `${site.brand} project inquiry`,
        text: [
          `New ${site.brand} project inquiry`,
          `Reference: ${id}`,
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone || "Not provided"}`,
          `Rental date: ${data.startDate}`,
          `Location: ${data.location}`,
          `Service: ${data.service}`,
          `Rental duration: ${data.duration}`,
          `Industry: ${data.industry}`,
          "",
          data.message,
        ].join("\n"),
      };
    },
    send: async (message, key) => {
      const result = await new Resend(required("RESEND_API_KEY")).emails.send(
        message,
        { idempotencyKey: key },
      );
      if (result.error || !result.data) throw Error("Provider send failed");
      return result.data.id;
    },
  });
}
export function dependencies() {
  const { db, appCheck } = firebase();
  return {
    enabled: process.env.CONTACT_ENABLED === "true",
    origins: required("ALLOWED_ORIGINS")
      .split(",")
      .map((s) => s.trim()),
    verify: async (token: string) => {
      const verified = await appCheck.verifyToken(token);
      if (verified.appId !== required("FIREBASE_APP_ID"))
        throw Error("Wrong application");
    },
    limit: (ip: string) => rateLimit(db, ip),
    save: (key: string, data: Lead) => saveLead(db, key, data),
    deliver: async (id: string) => {
      await deliverLead(id);
    },
  };
}
