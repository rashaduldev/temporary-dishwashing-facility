import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { load } from "cheerio";
import { cityEditorial } from "../src/cityEditorial.ts";

const inventory = JSON.parse(await readFile("src/cityDirectory.json", "utf8"));
const stateGuides = (await import("../src/stateGuides.ts")).stateGuides;
const slug = (text) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const fileFor = (url) =>
  join("dist", ...url.split("/").filter(Boolean), "index.html");
const issues = [];
const geoids = new Set();
const paths = new Set();
const expectedByRegion = new Map();
const reviewedPaths = new Set();
for (const row of inventory.records) {
  const [geoid, name, state, regionIndex, citySlug] = row;
  const region = stateGuides[state]?.regions[regionIndex];
  if (!region) issues.push(`Unknown region for ${geoid}`);
  const regionPath = `/service-areas/${slug(state)}/${slug(region)}/`;
  const cityPath = `${regionPath}${citySlug}/`;
  if (geoids.has(geoid)) issues.push(`Duplicate Census ID ${geoid}`);
  if (paths.has(cityPath)) issues.push(`Duplicate city path ${cityPath}`);
  geoids.add(geoid);
  paths.add(cityPath);
  expectedByRegion.set(regionPath, (expectedByRegion.get(regionPath) || 0) + 1);
  if (cityEditorial[geoid]) reviewedPaths.add(cityPath);
}
if (inventory.records.length < 19000)
  issues.push(`Unexpected inventory size ${inventory.records.length}`);
if (expectedByRegion.size !== 246)
  issues.push(
    `Expected 246 region directories, found ${expectedByRegion.size}`,
  );

for (const route of ["/", "/service-areas/"]) {
  const serviceAreasHtml = await readFile(fileFor(route), "utf8");
  const serviceAreas = load(serviceAreasHtml);
  const mapCityLinks = new Map();
  serviceAreas(".map-location-directory a[data-directory-city]").each(
    (_, element) => {
      const href = serviceAreas(element).attr("href");
      const label = serviceAreas(element).text().trim();
      if (!href || !reviewedPaths.has(href))
        issues.push(`Map links unreviewed city ${href || "without href"}`);
      if (!label) issues.push(`Map city link lacks a readable name: ${href}`);
      if (href) mapCityLinks.set(href, (mapCityLinks.get(href) || 0) + 1);
    },
  );
  for (const path of reviewedPaths) {
    if (mapCityLinks.get(path) !== 1)
      issues.push(`Map must link reviewed city exactly once: ${path}`);
  }
  if (mapCityLinks.size !== reviewedPaths.size)
    issues.push(
      `Map exposes ${mapCityLinks.size} city links, expected ${reviewedPaths.size}`,
    );
}

for (const [regionPath, expected] of expectedByRegion) {
  const html = await readFile(fileFor(`${regionPath}cities/`), "utf8");
  const $ = load(html);
  const entries = $("[data-city-item]");
  if (entries.length !== expected)
    issues.push(`${regionPath} lists ${entries.length}, expected ${expected}`);
  $(".city-directory-grid a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!reviewedPaths.has(href))
      issues.push(`${regionPath} links unreviewed city ${href}`);
  });
}

const textBodies = [];
const titles = new Set();
const photoPaths = new Set();
for (const row of inventory.records) {
  const [geoid, , state, regionIndex, citySlug] = row;
  const region = stateGuides[state].regions[regionIndex];
  const cityPath = `/service-areas/${slug(state)}/${slug(region)}/${citySlug}/`;
  if (!cityEditorial[geoid]) {
    try {
      await stat(fileFor(cityPath));
      issues.push(`Unreviewed city generated as a page: ${cityPath}`);
    } catch {}
    continue;
  }
  const html = await readFile(fileFor(cityPath), "utf8");
  const $ = load(html);
  const title = $("title").text().trim();
  const h1 = $("main h1").first().text().trim();
  const words = $("main article")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .split(" ").length;
  const images = $("main article img").length;
  if (titles.has(title)) issues.push(`Duplicate city title: ${title}`);
  titles.add(title);
  if (!h1.includes(row[1]) || !/Rental|Lease/.test(h1))
    issues.push(`Weak city H1: ${cityPath}`);
  if (words < 250 || words > 500)
    issues.push(`City word count ${words}: ${cityPath}`);
  if (images < 1 || images > 2)
    issues.push(`City image count ${images}: ${cityPath}`);
  const photo = $("main article img").first().attr("src");
  if (!photo || photoPaths.has(photo))
    issues.push(`Missing or repeated city photo: ${cityPath}`);
  if (photo) photoPaths.add(photo);
  if (!$(".city-sources a[href]").length)
    issues.push(`Missing local source: ${cityPath}`);
  if ($(".breadcrumb a").length < 4)
    issues.push(`Incomplete breadcrumb: ${cityPath}`);
  if (!html.includes("Emergency 24/7"))
    issues.push(`Missing emergency support: ${cityPath}`);
  const editorial = cityEditorial[geoid];
  textBodies.push({
    path: cityPath,
    text: `${editorial.intro} ${editorial.answer} ${editorial.local} ${editorial.seasonal} ${editorial.question}`,
  });
}

const shingles = (text) => {
  const terms = text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return new Set(
    terms
      .slice(0, -4)
      .map((_, index) => terms.slice(index, index + 5).join(" ")),
  );
};
for (let i = 0; i < textBodies.length; i++) {
  for (let j = i + 1; j < textBodies.length; j++) {
    const a = shingles(textBodies[i].text);
    const b = shingles(textBodies[j].text);
    const overlap = [...a].filter((part) => b.has(part)).length;
    const similarity = overlap / (a.size + b.size - overlap);
    if (similarity > 0.35)
      issues.push(
        `Near-duplicate city substance ${similarity.toFixed(2)}: ${textBodies[i].path} and ${textBodies[j].path}`,
      );
  }
}

console.log(
  JSON.stringify({
    censusPlaces: inventory.records.length,
    regionDirectories: expectedByRegion.size,
    reviewedCityPages: reviewedPaths.size,
    issues: issues.slice(0, 30),
  }),
);
if (issues.length) process.exitCode = 1;
