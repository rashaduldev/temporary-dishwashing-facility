import { isIP } from "node:net";
import { z } from "zod";
import { leadSchema, type Lead } from "./schema.js";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public retryAfter?: number,
  ) {
    super(message);
  }
}
export type Deps = {
  enabled: boolean;
  origins: string[];
  verify: (token: string) => Promise<void>;
  limit: (ip: string) => Promise<void>;
  save: (key: string, data: Lead) => Promise<string>;
  deliver: (id: string) => Promise<void>;
};
export async function submit(
  request: {
    method?: string;
    headers: Record<string, string | undefined>;
    body: string;
  },
  deps: Deps,
) {
  if (request.method !== "POST") throw new HttpError(405, "Use POST.");
  if (!deps.enabled)
    throw new HttpError(
      503,
      "Inquiries are not enabled yet. Please try again later.",
    );
  if (!request.headers.origin || !deps.origins.includes(request.headers.origin))
    throw new HttpError(403, "Request origin is not allowed.");
  if (
    request.headers["content-type"]?.split(";")[0].trim() !== "application/json"
  )
    throw new HttpError(415, "Use application/json.");
  if (Buffer.byteLength(request.body) > 8192)
    throw new HttpError(413, "Inquiry is too large.");
  let json: unknown;
  try {
    json = JSON.parse(request.body);
  } catch {
    throw new HttpError(400, "Invalid JSON.");
  }
  const data = leadSchema.safeParse(json);
  if (!data.success)
    throw new HttpError(400, "Check the form fields and try again.");
  const key = request.headers["idempotency-key"];
  if (!z.uuid().safeParse(key).success)
    throw new HttpError(400, "Invalid request identifier.");
  const ip = request.headers["x-vercel-forwarded-for"];
  if (!ip || !isIP(ip))
    throw new HttpError(503, "Unable to verify the request network.");
  const token = request.headers["x-firebase-appcheck"];
  if (!token || token.length > 4096)
    throw new HttpError(403, "Form verification is required.");
  try {
    await deps.verify(token);
  } catch {
    throw new HttpError(403, "Form verification failed. Please retry.");
  }
  await deps.limit(ip);
  const id = await deps.save(key!, data.data);
  // The saved outbox is authoritative. Email failure must not lose the inquiry.
  try {
    await deps.deliver(id);
  } catch {
    console.error(JSON.stringify({ event: "delivery_pending", id }));
  }
  return { status: 201, body: { ok: true } };
}
