import type { IncomingMessage, ServerResponse } from "node:http";
/** Structural types supplied by Vercel's Node function runtime. No runtime SDK needed. */
export interface VercelRequest extends IncomingMessage {
  body?: unknown;
}
export interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(value: unknown): VercelResponse;
}
