import fs from "node:fs/promises";
import path from "node:path";
import { stateGuides } from "../src/stateGuides.ts";
import { regionCities } from "../src/regionCities.ts";
import { regionPath, regionSlug } from "../src/regionGuides.tsx";

const root = process.cwd();
const outputDirectory = path.join(root, "public", "location-media");
const manifestPath = path.join(root, "src", "locationPhotos.json");
const auditPath = path.join(root, "audit", "location-photo-sources.json");
const userAgent =
  "Temporary123-site-builder/1.0 (licensed website media selection)";
const usedPageIds = new Set();
let lastSearchAt = 0;
const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const cleanText = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const excluded =
  /\b(map|flag|logo|seal|diagram|drawing|plan|sheet|sign|marker|plaque|pdf|locator|route shield|coat of arms|icon|postcard|fish|grayling|salmon|trout|bird|flower|plant|insect|specimen|portrait|statue|monument|memorial|sculpture|cemetery|coin|stamp|book|newspaper)\b/i;
const preferred =
  /\b(aerial|skyline|downtown|landscape|scenic|mountain|river|coast|harbor|forest|valley|panorama|view|park|highway|road)\b/i;

async function searchCommons(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "18",
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1280",
    format: "json",
    origin: "*",
  });
  const elapsed = Date.now() - lastSearchAt;
  if (elapsed < 750) await sleep(750 - elapsed);
  lastSearchAt = Date.now();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?${params}`,
      {
        headers: { "user-agent": userAgent },
      },
    );
    if (response.ok) {
      const data = await response.json();
      return Object.values(data.query?.pages || {});
    }
    if (response.status !== 429)
      throw new Error(`Commons search failed: ${response.status}`);
    await sleep((attempt + 1) * 4000);
  }
  throw new Error("Commons search remained rate limited after retries");
}

function rankCandidate(page, terms) {
  const info = page.imageinfo?.[0];
  if (!info?.thumburl || !/^image\/(jpeg|png|webp)$/i.test(info.mime || ""))
    return -1000;
  const title = page.title.replace(/^File:/, "");
  if (excluded.test(title)) return -500;
  if ((info.width || 0) < 900 || (info.height || 0) < 500) return -400;
  const ratio = info.width / info.height;
  let score = ratio >= 1.25 && ratio <= 2.4 ? 8 : ratio >= 1 ? 3 : -4;
  if (preferred.test(title)) score += 4;
  for (const term of terms)
    if (title.toLowerCase().includes(term.toLowerCase())) score += 5;
  if (/\.jpe?g$/i.test(title)) score += 2;
  return score;
}

async function selectPhoto(queries, terms) {
  const candidates = [];
  for (const query of queries) {
    const pages = await searchCommons(query);
    for (const page of pages) candidates.push(page);
    const available = candidates
      .filter((page) => !usedPageIds.has(page.pageid))
      .sort((a, b) => rankCandidate(b, terms) - rankCandidate(a, terms));
    if (available[0] && rankCandidate(available[0], terms) >= 0) {
      usedPageIds.add(available[0].pageid);
      return available[0];
    }
  }
  const fallback = candidates
    .filter((page) => !usedPageIds.has(page.pageid))
    .sort((a, b) => rankCandidate(b, terms) - rankCandidate(a, terms))[0];
  if (!fallback || rankCandidate(fallback, terms) < -350)
    throw new Error(`No suitable photo for ${queries.join(" | ")}`);
  usedPageIds.add(fallback.pageid);
  return fallback;
}

async function downloadPhoto(page, fileStem, alt, caption) {
  const info = page.imageinfo[0];
  const response = await fetch(info.thumburl, {
    headers: { "user-agent": userAgent },
  });
  if (!response.ok)
    throw new Error(`Image download failed: ${response.status}`);
  const contentType = response.headers.get("content-type") || info.mime;
  const extension = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";
  const fileName = `${fileStem}-${page.pageid}.${extension}`;
  await fs.writeFile(
    path.join(outputDirectory, fileName),
    Buffer.from(await response.arrayBuffer()),
  );
  const metadata = info.extmetadata || {};
  return {
    image: `/location-media/${fileName}`,
    imageAlt: alt,
    caption,
    title: page.title.replace(/^File:/, ""),
    author: cleanText(
      metadata.Artist?.value ||
        metadata.Credit?.value ||
        "Wikimedia Commons contributor",
    ),
    license: cleanText(
      metadata.LicenseShortName?.value ||
        metadata.UsageTerms?.value ||
        "See source",
    ),
    licenseUrl: metadata.LicenseUrl?.value || info.descriptionurl,
    sourceUrl: info.descriptionurl,
    width: info.thumbwidth,
    height: info.thumbheight,
  };
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
      if ((index + 1) % 20 === 0)
        process.stdout.write(`selected ${index + 1}/${items.length}\n`);
    }
  }
  await Promise.all(Array.from({ length: limit }, run));
  return results;
}

await fs.mkdir(outputDirectory, { recursive: true });
const stateEntries = Object.entries(stateGuides);

const stateItems = await mapLimit(stateEntries, 1, async ([state, guide]) => {
  const city = regionCities(state, 0)[0];
  const page = await selectPhoto(
    [
      `${state} landscape scenic`,
      `${city} ${state} skyline`,
      `${state} aerial landscape`,
    ],
    [state, city],
  );
  return [
    state,
    await downloadPhoto(
      page,
      `state-${regionSlug(state)}`,
      `Landscape or city view in ${state}`,
      `Location reference for temporary facility planning in ${state}.`,
    ),
  ];
});

const regionEntries = stateEntries.flatMap(([state, guide]) =>
  guide.regions.map((region, regionIndex) => ({
    state,
    region,
    regionIndex,
    cities: regionCities(state, regionIndex),
  })),
);

const regionItems = await mapLimit(
  regionEntries,
  1,
  async ({ state, region, regionIndex, cities }) => {
    const page = await selectPhoto(
      [
        `${cities[0]} ${state} skyline`,
        `${region} ${state} scenic`,
        `${cities[1]} ${state} landscape`,
        `${cities[0]} ${state}`,
        `${state} landscape scenic`,
      ],
      [cities[0], cities[1], region, state],
    );
    const key = regionPath(state, region);
    return [
      key,
      await downloadPhoto(
        page,
        `region-${regionSlug(state)}-${regionSlug(region)}`,
        `Full location view near ${cities[0]} in the ${region} travel region of ${state}`,
        `${region} location reference near ${cities[0]}, ${state}.`,
      ),
    ];
  },
);

const manifest = {
  states: Object.fromEntries(stateItems),
  regions: Object.fromEntries(regionItems),
};
const referencedFiles = new Set(
  [...stateItems, ...regionItems].map(([, photo]) =>
    path.basename(photo.image),
  ),
);
for (const fileName of await fs.readdir(outputDirectory)) {
  if (!referencedFiles.has(fileName))
    await fs.unlink(path.join(outputDirectory, fileName));
}
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
await fs.writeFile(
  auditPath,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), provider: "Wikimedia Commons", count: stateItems.length + regionItems.length, ...manifest }, null, 2)}\n`,
);
process.stdout.write(
  `saved ${stateItems.length} state photos and ${regionItems.length} regional photos\n`,
);
