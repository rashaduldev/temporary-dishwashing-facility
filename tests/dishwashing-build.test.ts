import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import {
  dishwashingRoutes,
  referenceDishwashingUrlMap,
  siteConfig,
} from "../src/dishwashingConfig";
import { pilotUrlMap } from "../src/dishwashingContent";

const distPath = (...parts: string[]) => join(process.cwd(), "dist", ...parts);

async function pageHtml(pathname: string): Promise<string> {
  const parts = pathname === "/" ? [] : pathname.split("/").filter(Boolean);
  return readFile(distPath(...parts, "index.html"), "utf8");
}

describe("dishwashing static build", () => {
  it("prerenders every pilot URL and the real 404 page", async () => {
    for (const { path } of pilotUrlMap) {
      await expect(stat(distPath(...path.split("/").filter(Boolean), "index.html"))).resolves.toBeTruthy();
    }
    await expect(stat(distPath("404.html"))).resolves.toBeTruthy();
  });

  it("keeps all preview pages out of search until launch approval", async () => {
    for (const path of Object.values(dishwashingRoutes)) {
      const $ = load(await pageHtml(path));
      expect($("meta[name='robots']").attr("content")).toBe("noindex,follow");
      expect($("h1")).toHaveLength(1);
    }
    expect(await readFile(distPath("sitemap.xml"), "utf8")).not.toContain("<url>");
  });

  it("keeps production release gates closed without creating an indexing dead end", async () => {
    const site = JSON.parse(await readFile(join(process.cwd(), "site.json"), "utf8"));
    expect(site).toMatchObject({
      mode: "preview",
      domainRoutingReady: false,
      legacyUrlInventoryComplete: false,
      dashboardAuthReady: false,
      calculatorPricingApproved: false,
    });

    const vercel = JSON.parse(await readFile(join(process.cwd(), "vercel.json"), "utf8"));
    const globalHeaders = vercel.headers.find((rule: { source: string }) => rule.source === "/(.*)").headers;
    expect(globalHeaders.some((header: { key: string }) => header.key === "X-Robots-Tag")).toBe(false);
    const adminHeaders = vercel.headers.find((rule: { source: string }) => rule.source === "/seo/dashboard/(.*)").headers;
    expect(adminHeaders).toContainEqual({ key: "X-Robots-Tag", value: "noindex, nofollow" });
  });

  it("maps the Temp123 dishwashing links to one-hop canonical destinations", async () => {
    const vercel = JSON.parse(await readFile(join(process.cwd(), "vercel.json"), "utf8"));

    for (const expected of referenceDishwashingUrlMap) {
      expect(vercel.redirects).toContainEqual({
        source: expected.source,
        destination: expected.destination,
        permanent: true,
      });
      expect(Object.values(dishwashingRoutes)).toContain(expected.destination);
    }
  });

  it("uses clean canonical URLs except on private admin pages", async () => {
    for (const path of Object.values(dishwashingRoutes)) {
      const $ = load(await pageHtml(path));
      const canonical = $("link[rel='canonical']").attr("href");
      if (path.startsWith("/seo/dashboard/")) {
        expect(canonical).toBeUndefined();
      } else {
        expect(canonical).toBe(new URL(path, `${siteConfig.origin}/`).toString());
      }
    }
  });

  it("renders the normalized phone URI and no enabled submission form", async () => {
    const $ = load(await pageHtml("/"));
    expect($(`a[href='tel:${siteConfig.phoneE164}']`).length).toBeGreaterThan(0);
    expect($("form button[type='submit']:not([disabled])")).toHaveLength(0);
  });

  it("ships the supplied logo and PNG favicon on every prerendered page", async () => {
    await expect(stat(distPath("favicon.png"))).resolves.toBeTruthy();
    await expect(stat(distPath("dishwashing-facility-logo.png"))).resolves.toBeTruthy();
    const $ = load(await pageHtml("/"));
    expect($("link[rel='icon']").attr("href")).toBe("/favicon.png");
    expect($("img.dw-brand-logo[src='/dishwashing-facility-logo.png']").length).toBeGreaterThanOrEqual(2);
  });

  it("renders the accessible 50-state coverage map on home and service-area pages", async () => {
    for (const path of ["/", dishwashingRoutes.serviceAreas]) {
      const $ = load(await pageHtml(path));
      expect($(".dw-coverage-map")).toHaveLength(1);
      expect($(".dw-map-land path[role='button']")).toHaveLength(50);
      expect($(".dw-map-controls select option")).toHaveLength(51);
      expect($(".dw-coverage-map figcaption").text()).toContain("No state-level availability is implied");
    }
  });
});
