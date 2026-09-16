import { describe, it, vi, expect } from "vitest";
import type { VercelRequest, VercelResponse } from "../server/types";
import handler from "../api/contact";
import deliver from "../api/deliver";
function response() {
  const res = { setHeader: vi.fn(), status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}
describe("actual Vercel entry points", () => {
  it("contact rejects GET before initializing credentials", async () => {
    const res = response();
    await handler(
      { method: "GET" } as VercelRequest,
      res as unknown as VercelResponse,
    );
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.setHeader).toHaveBeenCalledWith("Allow", "POST");
  });
  it("contact fails closed without configuration", async () => {
    delete process.env.CONTACT_ENABLED;
    const res = response();
    await handler(
      { method: "POST" } as VercelRequest,
      res as unknown as VercelResponse,
    );
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "private, no-store",
    );
  });
  it("outbox rejects GET mutations", async () => {
    const res = response();
    await deliver(
      { method: "GET" } as VercelRequest,
      res as unknown as VercelResponse,
    );
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("outbox rejects an invalid scheduler credential", async () => {
    process.env.CRON_SECRET = "synthetic-job-test-secret-32-bytes";
    const res = response();
    await deliver(
      {
        method: "POST",
        headers: { authorization: "Bearer forged" },
      } as VercelRequest,
      res as unknown as VercelResponse,
    );
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
