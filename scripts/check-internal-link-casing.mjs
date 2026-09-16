import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { load } from "cheerio";

const pages = [];
const collect = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (entry.name === "index.html") pages.push(path);
  }
};

await collect("dist");
const issues = [];
for (const path of pages) {
  const $ = load(await readFile(path, "utf8"));
  $("a[href]").each((_, anchor) => {
    const href = $(anchor).attr("href") || "";
    if (!href.startsWith("/")) return;
    const label = $(anchor).text().replace(/\s+/g, " ").trim();
    const firstLetter = label.match(/^([A-Za-z])/)?.[1];
    if (firstLetter && firstLetter === firstLetter.toLowerCase())
      issues.push({ path: path.replace(/^dist/, ""), href, label });
  });
}

console.log(
  JSON.stringify({
    pages: pages.length,
    issues: issues.length,
    labels: [...new Set(issues.map((issue) => issue.label))],
  }),
);
if (issues.length) process.exitCode = 1;
