import { readFileSync, writeFileSync, mkdirSync, globSync } from "node:fs";
import { load } from "cheerio";
import { createHash } from "node:crypto";
const pages = [...globSync("dist/**/*.html")].map((file) => {
  const $ = load(readFileSync(file, "utf8"));
  const main = $("main").clone();
  main.find("nav, .source-aside, script, style").remove();
  const article = main.find(".source-content");
  const body = article.length ? article.text() : main.text();
  const path =
    "/" +
    file
      .replaceAll("\\", "/")
      .replace(/^dist\//, "")
      .replace(/index\.html$/, "");
  const title = $("h1").text().trim();
  const city = title.replace(/\s+Mobile Kitchen Rental.*$/i, "");
  const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const normalized = body
    .toLowerCase()
    .replace(
      new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "giu"),
      "[location]",
    )
    .replace(/\s+/g, " ")
    .trim();
  return {
    path,
    heading: title,
    title: $("title").text(),
    description: $('meta[name="description"]').attr("content"),
    words: body.trim().split(/\s+/).length,
    normalized,
    fingerprint: createHash("sha256").update(normalized).digest("hex"),
    paragraphs: article
      .find("p,li")
      .map((_, n) => $(n).text().replace(/\s+/g, " ").trim())
      .get()
      .filter((x) => x.length > 120),
  };
});
const groups = (key) => {
  const buckets = new Map();
  for (const p of pages) {
    const value = p[key];
    if (!value) continue;
    const list = buckets.get(value) || [];
    list.push(p.path);
    buckets.set(value, list);
  }
  return [...buckets.values()].filter((x) => x.length > 1);
};
const paragraphs = new Map();
for (const p of pages)
  for (const text of new Set(p.paragraphs)) {
    const paths = paragraphs.get(text) || [];
    paths.push(p.path);
    paragraphs.set(text, paths);
  }
const report = {
  generatedAt: new Date().toISOString(),
  pageCount: pages.length,
  method:
    "Rendered main content; navigation and sidebars excluded. Imported articles compared after replacing their own location name. Matching groups indicate editorial overlap, not a Google penalty or proof of indexing status.",
  duplicateTitles: groups("title"),
  duplicateHeadings: groups("heading"),
  duplicateDescriptions: groups("description"),
  locationNormalizedDuplicateGroups: groups("fingerprint"),
  repeatedParagraphs: [...paragraphs]
    .filter(([, paths]) => paths.length >= 10)
    .map(([text, paths]) => ({ text, count: paths.length, paths }))
    .sort((a, b) => b.count - a.count),
  thinPages: pages
    .filter((p) => p.words < 100)
    .map(({ path, words }) => ({ path, words })),
  inventory: pages.map(({ path, title, words }) => ({ path, title, words })),
};
mkdirSync("audit", { recursive: true });
writeFileSync("audit/ui-content-review.json", JSON.stringify(report, null, 2));
console.log(
  JSON.stringify({
    pages: pages.length,
    duplicateTitleGroups: report.duplicateTitles.length,
    duplicateDescriptionGroups: report.duplicateDescriptions.length,
    locationNormalizedDuplicateGroups:
      report.locationNormalizedDuplicateGroups.length,
    pagesInGroups: report.locationNormalizedDuplicateGroups.reduce(
      (n, g) => n + g.length,
      0,
    ),
    repeatedParagraphs: report.repeatedParagraphs.length,
    thinPages: report.thinPages.length,
  }),
);
