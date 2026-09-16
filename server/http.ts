import type { VercelRequest, VercelResponse } from "./types.js";
import { HttpError } from "./contact.js";
export function headers(req: VercelRequest) {
  return Object.fromEntries(
    Object.entries(req.headers).map(([k, v]) => [
      k.toLowerCase(),
      typeof v === "string" ? v : undefined,
    ]),
  );
}
export function secure(res: VercelResponse) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'",
  );
  res.setHeader("Referrer-Policy", "no-referrer");
}
export async function body(req: VercelRequest) {
  // Vercel can preparse req.body; its platform cap applies before this function.
  if (req.body !== undefined) {
    const text = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body);
    if (Buffer.byteLength(text) > 8192)
      throw new HttpError(413, "Inquiry is too large.");
    return text;
  }
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    const b = Buffer.from(chunk);
    size += b.length;
    if (size > 8192) throw new HttpError(413, "Inquiry is too large.");
    chunks.push(b);
  }
  return Buffer.concat(chunks).toString("utf8");
}
export function fail(res: VercelResponse, e: unknown) {
  if (e instanceof HttpError) {
    console.warn(
      JSON.stringify({ event: "inquiry_rejected", status: e.status }),
    );
    if (e.retryAfter) res.setHeader("Retry-After", String(e.retryAfter));
    if (e.status === 405) res.setHeader("Allow", "POST");
    return res.status(e.status).json({ error: e.message });
  }
  console.error(JSON.stringify({ event: "inquiry_unavailable" }));
  return res.status(503).json({
    error: "Inquiries are temporarily unavailable. Please retry later.",
  });
}
