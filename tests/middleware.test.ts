import { describe, expect, it } from "vitest";
import middleware from "../middleware";

describe("SEO dashboard middleware", () => {
  it("serves the dashboard with private, noindex headers", () => {
    const response = middleware();
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
});
