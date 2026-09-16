import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { load } from "cheerio";
import { stateGuides } from "../src/stateGuides.ts";
import { statePath } from "../src/statePaths.ts";
import { regionPages } from "../src/regionGuides.tsx";
import { reviewedCityPages } from "../src/cityDirectory.ts";
import { regionLocationLabel } from "../src/rentalHeadlines.ts";

const cases = [{ path: "/service-areas/", prefix: "USA " }];
for (const state of Object.keys(stateGuides))
  cases.push({ path: statePath(state), prefix: `${state} ` });
for (const region of regionPages) {
  const prefix = `${regionLocationLabel(region.region, region.state)} `;
  cases.push({ path: region.path, prefix });
  cases.push({ path: `${region.path}cities/`, prefix });
}
for (const city of reviewedCityPages)
  cases.push({ path: city.path, prefix: `${city.name}, ${city.state} ` });

const issues = [];
const headings = new Map();
for (const { path, prefix } of cases) {
  const file = join("dist", ...path.split("/").filter(Boolean), "index.html");
  const $ = load(await readFile(file, "utf8"));
  const h1 = $("main h1").first().text().replace(/\s+/g, " ").trim();
  const title = $("title").text().trim();
  if (!h1.startsWith(prefix))
    issues.push(`${path}: geography is not first: ${h1}`);
  if (!/(Rental|Rentals|Lease)/.test(h1))
    issues.push(`${path}: no rental intent: ${h1}`);
  if (h1.length > 75) issues.push(`${path}: H1 exceeds 75 characters: ${h1}`);
  if (!title.startsWith(h1))
    issues.push(`${path}: title and H1 differ: ${title}`);
  if (headings.has(h1))
    issues.push(`${path}: duplicate H1 shared with ${headings.get(h1)}`);
  headings.set(h1, path);
}

console.log(
  JSON.stringify({
    locationPages: cases.length,
    uniqueHeadlines: headings.size,
    issues: issues.slice(0, 30),
  }),
);
if (issues.length) process.exitCode = 1;
