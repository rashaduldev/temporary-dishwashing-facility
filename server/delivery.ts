import { randomUUID } from "node:crypto";
import type { Database } from "firebase-admin/database";
import type { Resend } from "resend";
export type Mail = Parameters<Resend["emails"]["send"]>[0];
export type DeliveryDeps = {
  db: Database;
  send: (message: Mail, key: string) => Promise<string>;
  createMessage: (data: Record<string, unknown>, id: string) => Mail;
  now?: () => number;
};
export async function processDelivery(
  id: string,
  { db, send, createMessage, now = Date.now }: DeliveryDeps,
) {
  const ref = db.ref("inquiries/" + id),
    leaseId = randomUUID();
  // null must be returned (not aborted) on an uncached first transaction pass.
  // The SDK retries against the actual server state before committing.
  const claim = await ref.transaction((current) => {
    if (!current) return null;
    if (current.status !== "queued" || current.leaseUntil > now()) return;
    if (now() - current.createdAt >= 23 * 3600000)
      return { ...current, status: "manual_review" };
    return {
      ...current,
      message: current.message || createMessage(current, id),
      leaseId,
      leaseUntil: now() + 60000,
    };
  });
  const value = claim.snapshot.val();
  if (
    !claim.committed ||
    value?.leaseId !== leaseId ||
    value.status !== "queued"
  )
    return false;
  try {
    const emailId = await send(value.message, `temporary123/${id}`);
    await ref.transaction((current) =>
      !current
        ? null
        : current.leaseId === leaseId
          ? { ...current, status: "sent", emailId }
          : undefined,
    );
    return true;
  } catch {
    await ref.transaction((current) =>
      !current
        ? null
        : current.leaseId === leaseId && current.status === "queued"
          ? { ...current, leaseUntil: 0 }
          : undefined,
    );
    throw Error("Delivery failed; retained for retry");
  }
}
