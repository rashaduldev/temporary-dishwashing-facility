import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SeoDashboard } from "../src/SeoDashboard";
import { Site } from "../src/Site";
import {
  dashboardSectionLinks,
  defaultSeoDashboardData,
} from "../src/seoDashboardData";

describe("owner SEO dashboard", () => {
  const markupBySection = Object.fromEntries(
    dashboardSectionLinks.map((section) => [
      section.id,
      renderToStaticMarkup(createElement(SeoDashboard, { section: section.id })),
    ]),
  );
  const markup = Object.values(markupBySection).join("\n");
  const overviewMarkup = markupBySection.overview;
  const nextChecksMarkup = markupBySection["next-checks"];

  it("renders exactly seven evidence-labelled vital cards", () => {
    expect(defaultSeoDashboardData.metrics).toHaveLength(7);
    for (const metric of defaultSeoDashboardData.metrics) {
      expect(markup).toContain(metric.label);
      expect(markup).toContain(metric.source);
      expect(markup).toContain(metric.freshness);
      expect(markup).toContain(metric.drilldownHref);
    }
  });

  it("preserves every required dashboard section", () => {
    for (const section of dashboardSectionLinks) {
      expect(markupBySection[section.id]).toContain(`id="${section.id}"`);
      expect(markupBySection[section.id]).toContain(`href="${section.href}"`);
      expect(markupBySection[section.id]).toContain(section.pageTitle);
    }
  });

  it("renders admin routes without the public website shell", () => {
    const adminMarkup = renderToStaticMarkup(
      createElement(Site, { path: "/seo/dashboard/diagnostics/" }),
    );
    expect(adminMarkup).toContain('<main class="seo-main"');
    expect(adminMarkup).not.toContain("dw-header");
    expect(adminMarkup).not.toContain("dw-footer");
    expect(adminMarkup).not.toContain("dw-support-dock");
    expect(adminMarkup).not.toContain("dw-urgent-bar");
  });

  it("uses honest disconnected states and never implies zero or success", () => {
    expect(markup).toContain("Not connected");
    expect(markup).toContain("Unknown");
    expect(overviewMarkup).toContain("Insufficient history");
    expect(overviewMarkup).toContain("Checked");
    expect(overviewMarkup).not.toMatch(/>0<\/p>/);
  });

  it("keeps sensitive controls disabled until integrations exist", () => {
    expect(markup).toContain('data-owner-only="true"');
    expect(markup).toContain('data-robots="noindex,nofollow"');
    expect(overviewMarkup).toContain("Run verified checks");
    expect(overviewMarkup).toContain("Refresh unavailable");
    expect(nextChecksMarkup).toMatch(/<button[^>]*disabled=""[^>]*>Export CSV<\/button>/);
    expect(nextChecksMarkup).toMatch(/<button[^>]*disabled=""[^>]*>Export PDF<\/button>/);
  });

  it("keeps Google and authority evidence categories distinct", () => {
    expect(markup).toContain("Google Verified Indexed");
    expect(markup).toContain("Google Verified Not Indexed");
    expect(markup).toContain("Google Status Unknown");
    expect(markup).toContain("Ahrefs Crawled");
    expect(markup).toContain("Ranking Detected — Likely Indexed");
    expect(markup).toContain("Ahrefs Domain Rating");
    expect(markup).toContain("Moz Domain Authority");
    expect(markup).toContain("DA is not interchangeable with DR");
  });
});
