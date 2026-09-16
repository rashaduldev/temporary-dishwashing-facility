import { afterEach, describe, expect, it } from "vitest";
import middleware from "../middleware";

const originalUsername = process.env.SEO_DASHBOARD_USERNAME;
const originalPassword = process.env.SEO_DASHBOARD_PASSWORD;

afterEach(() => {
  if (originalUsername === undefined) delete process.env.SEO_DASHBOARD_USERNAME;
  else process.env.SEO_DASHBOARD_USERNAME = originalUsername;
  if (originalPassword === undefined) delete process.env.SEO_DASHBOARD_PASSWORD;
  else process.env.SEO_DASHBOARD_PASSWORD = originalPassword;
});

describe("owner dashboard middleware", () => {
  it("fails closed when credentials are not configured", async () => {
    delete process.env.SEO_DASHBOARD_USERNAME;
    delete process.env.SEO_DASHBOARD_PASSWORD;
    const response = await middleware(new Request("https://example.com/seo/dashboard/"));
    expect(response.status).toBe(404);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it("challenges missing or invalid authorization", async () => {
    process.env.SEO_DASHBOARD_USERNAME = "owner";
    process.env.SEO_DASHBOARD_PASSWORD = "test-only-password";
    const response = await middleware(new Request("https://example.com/seo/dashboard/"));
    expect(response.status).toBe(401);
    expect(response.headers.get("www-authenticate")).toContain("Basic");
  });

  it("continues only for matching credentials", async () => {
    process.env.SEO_DASHBOARD_USERNAME = "owner";
    process.env.SEO_DASHBOARD_PASSWORD = "test-only-password";
    const authorization = `Basic ${btoa("owner:test-only-password")}`;
    const response = await middleware(
      new Request("https://example.com/seo/dashboard/", {
        headers: { authorization },
      }),
    );
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
});
