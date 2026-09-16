import { describe, expect, it } from "vitest";
import {
  canonicalFor,
  modificationDate,
  productionBuild,
  routeInIndexingScope,
  routesForIndexingBatch,
  sitemapXml,
} from "../scripts/seo-policy";
import { renderSourceContent } from "../scripts/source-content";
import vercel from "../vercel.json";
import consolidation from "../content/location-consolidation.json";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { load } from "cheerio";

describe("evidence-based city consolidation", () => {
  it("retains source archives and only consolidates identical location articles", () => {
    const fingerprints = new Set<string>();
    for (const row of consolidation.routes) {
      const source = JSON.parse(
        gunzipSync(
          readFileSync(
            new URL(`../content/pages/${row.sourceFile}`, import.meta.url),
          ),
        ).toString(),
      );
      expect(source.id, row.path).toBe(row.sourceId);
      const html = renderSourceContent(source.html, {
        origin: "https://temporary123.com",
        routes: new Set(),
        redirects: new Map(),
        media: {},
        unresolved: new Set(),
      });
      const escaped = (row.sourceLocation || row.location).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const text = load(html)
        .text()
        .toLowerCase()
        .replace(
          new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "giu"),
          "[location]",
        )
        .replace(/\s+/g, " ")
        .trim();
      fingerprints.add(createHash("sha256").update(text).digest("hex"));
      expect(
        vercel.redirects.find((rule) => rule.source === row.path),
      ).toMatchObject({ destination: row.destination, permanent: true });
    }
    expect(fingerprints.size).toBe(1);
  });
});

describe("migration indexing separation", () => {
  it("keeps preview builds excluded even when editorial production mode is selected", () => {
    expect(productionBuild("production", "preview")).toBe(false);
    expect(productionBuild("draft", "production")).toBe(false);
    expect(canonicalFor("/gsa-schedule/", true, false)).toBeUndefined();
    expect(canonicalFor("/gsa-schedule/", true, true)).toBe(
      "https://temporary123.com/gsa-schedule/",
    );
    expect(canonicalFor("/video/", false, true)).toBeUndefined();
    expect(() => canonicalFor("//evil.example/", true, true)).toThrow();
  });
  it("limits this release to the homepage and service-area routes", () => {
    const scope = "homepage-and-service-areas";
    expect(routeInIndexingScope("/", scope)).toBe(true);
    expect(routeInIndexingScope("/service-areas/", scope)).toBe(true);
    expect(
      routeInIndexingScope(
        "/service-areas/washington/olympic-peninsula/",
        scope,
      ),
    ).toBe(true);
    expect(routeInIndexingScope("/equipment-rental/", scope)).toBe(false);
  });
  it("activates cumulative groups of 25 routes", () => {
    const routes = Array.from({ length: 63 }, (_, index) => `/route-${index}/`);
    expect(routesForIndexingBatch(routes, 1, 25)).toEqual(routes.slice(0, 25));
    expect(routesForIndexingBatch(routes, 2, 25)).toEqual(routes.slice(0, 50));
    expect(routesForIndexingBatch(routes, 3, 25)).toEqual(routes);
  });
  it("protects nonproduction hostnames, including static downloads", () => {
    const rule = vercel.headers.find((rule) => "missing" in rule);
    expect(rule).toMatchObject({
      source: "/(.*)",
      missing: [{ type: "host", value: "temporary123\\.com" }],
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    });
  });
  it("only emits canonical indexable production URLs and truthful modification dates", () => {
    const pages = [
      {
        path: "/gsa-schedule/",
        indexable: true,
        modified: "2025-12-12T21:04:39",
      },
      { path: "/video/", indexable: false },
      { path: "/about-us/", indexable: true },
    ];
    expect(sitemapXml(pages, false)).not.toContain("<url>");
    const xml = sitemapXml(pages, true);
    expect(xml).toContain("<lastmod>2025-12-12</lastmod>");
    expect(xml).not.toContain("/video/");
    expect((xml.match(/<lastmod>/g) || []).length).toBe(1);
    expect(modificationDate("2025-02-30")).toBeUndefined();
    expect(modificationDate("2099-01-01")).toBeUndefined();
  });
});

describe("preserve source meaning while repairing navigation", () => {
  const options = () => ({
    origin: "https://temporary123.com",
    routes: new Set(["/service-areas/", "/equipment-rental/"]),
    redirects: new Map([["/shop/", "/equipment-rental/"]]),
    media: {},
    unresolved: new Set<string>(),
  });
  it("removes only repeated directory sections, retaining the later business section", () => {
    const result = renderSourceContent(
      '<p>Original local details</p><h2>TOP 100 BIG CITIES THAT WE SERVED</h2>Mobile Kitchen Trailers in <p><a href="/missing-city/">City</a></p> – GSA Schedule Service Available<!-- directory footer --><h2>Equipment specifications</h2><p>Original dimensions</p>',
      options(),
    );
    expect(result).toContain("Original local details");
    expect(result).toContain("Original dimensions");
    expect(result).toContain("/service-areas/");
    expect(result).not.toContain("/missing-city/");
    expect(result).not.toContain("Mobile Kitchen Trailers in");
    expect(result).not.toContain("GSA Schedule Service Available");
    expect(result).not.toContain("directory footer");
  });
  it("normalizes known destinations, preserves query strings and records unrecovered pages", () => {
    const settings = options();
    const result = renderSourceContent(
      '<a href="https://www.temporary123.com/shop/?type=long#rent">Equipment</a><a href="/testimonials/">Testimonials</a>',
      settings,
    );
    expect(result).toContain("/equipment-rental/?type=long#rent");
    expect(result).toContain("https://temporary123.com/testimonials/");
    expect(settings.unresolved.has("/testimonials/")).toBe(true);
  });
});
