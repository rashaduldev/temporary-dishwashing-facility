import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";
const registry = JSON.parse(
  await readFile("audit/build-registry.json", "utf8"),
);
const issues = [],
  wordCounts = [],
  sets = new Set();
let schemas = 0,
  locationPages = 0,
  missingDimensions = 0;
for (const row of registry.pages) {
  const $ = load(await readFile(`dist${row.path}index.html`, "utf8"));
  const schema = JSON.parse($('script[type="application/ld+json"]').text());
  const graph = schema["@graph"];
  const types = graph.map((node) => node["@type"]);
  for (const type of ["Organization", "WebSite", "WebPage"])
    if (!types.includes(type)) issues.push([row.path, "missing-schema", type]);
  if (
    types.some((type) =>
      ["FAQPage", "Product", "LocalBusiness", "AggregateRating"].includes(type),
    )
  )
    issues.push([row.path, "unsupported-schema"]);
  const webpage = graph.find((node) => node["@type"] === "WebPage");
  if (webpage.name !== $("h1").text().trim())
    issues.push([row.path, "schema-h1-mismatch"]);
  if (webpage.description !== $('meta[name="description"]').attr("content"))
    issues.push([row.path, "schema-description-mismatch"]);
  const canonical = $('link[rel="canonical"]').attr("href");
  if (canonical && webpage.url !== canonical)
    issues.push([row.path, "schema-canonical-mismatch"]);
  const crumbs = $("nav.breadcrumb")
    .first()
    .find('a[href], [aria-current="page"]')
    .map((_, el) => $(el).text().trim())
    .get();
  const schemaCrumbs =
    graph
      .find((node) => node["@type"] === "BreadcrumbList")
      ?.itemListElement.map((item) => item.name) || [];
  if (JSON.stringify(crumbs) !== JSON.stringify(schemaCrumbs))
    issues.push([row.path, "breadcrumb-mismatch"]);
  schemas++;
  $("main img").each((_, el) => {
    if (!$(el).attr("width") || !$(el).attr("height")) missingDimensions++;
  });
  if (/^\/service-areas\/.+\/$/.test(row.path)) {
    locationPages++;
    const headline = $("h1").text().trim();
    if (!/rental|lease|facilities/i.test(headline))
      issues.push([row.path, "h1-commercial-intent"]);
    if (headline.length > 75)
      issues.push([row.path, "h1-too-long", headline.length]);
    for (const token of [/rental/i, /\brent\b/i, /\blease\b/i, /temporary facilities/i]) {
      if (!token.test($('meta[name="description"]').attr("content")))
        issues.push([row.path, "description-keyword", String(token)]);
    }
    if (!/Rental Planning Conditions/.test($("main").text()))
      issues.push([row.path, "missing-planning-heading"]);
    if (
      /delivery planning timeline|2 to 7 business days/i.test($("main").text())
    )
      issues.push([row.path, "delivery-timeline-remains"]);
    const images = $("main img")
      .map((_, el) => $(el).attr("src"))
      .get();
    if (
      images.length < 2 ||
      images.length > 3 ||
      new Set(images).size !== images.length
    )
      issues.push([row.path, "image-count-or-duplicate", images]);
    if (images.some((src) => src.startsWith("/location-media/")))
      issues.push([row.path, "scenery-image"]);
    const imageSet = [...images].sort().join("|");
    if (sets.has(imageSet)) issues.push([row.path, "repeated-photo-set"]);
    sets.add(imageSet);
    const words = $("main")
      .html()
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ").length;
    wordCounts.push(words);
    if (words < 250 || words > 500)
      issues.push([row.path, "word-count", words]);
  }
}
const report = {
  pages: registry.pages.length,
  schemas,
  locationPages,
  distinctPhotoSets: sets.size,
  wordRange: [Math.min(...wordCounts), Math.max(...wordCounts)],
  missingDimensions,
  issues,
};
await writeFile(
  "audit/location-schema-check.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report));
if (issues.length || missingDimensions) process.exitCode = 1;
