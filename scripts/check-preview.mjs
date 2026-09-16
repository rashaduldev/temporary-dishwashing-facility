import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { load } from "cheerio";

const root = resolve("dist");
const vercel = JSON.parse(await readFile("vercel.json", "utf8"));
const site = JSON.parse(await readFile("site.json", "utf8"));
const redirectSources = new Set(vercel.redirects.map((rule) => rule.source));
const registry = JSON.parse(
  await readFile("audit/build-registry.json", "utf8"),
);
const registeredPages = new Map(
  registry.pages.map((page) => [page.path, page]),
);
const review = JSON.parse(
  await readFile("content/migration-review.json", "utf8"),
);
const knownMissing = new Set(review.unresolvedPaths);
const pendingMigrationLinks = new Map();

async function files(dir) {
  const all = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      all.map((file) =>
        file.isDirectory()
          ? files(resolve(dir, file.name))
          : resolve(dir, file.name),
      ),
    )
  ).flat();
}

const routeForFile = (file) => {
  if (file.endsWith("404.html")) return "/404/";
  const folder = relative(root, file.slice(0, -"index.html".length)).replaceAll(
    "\\",
    "/",
  );
  return folder ? `/${folder.replace(/^\/+|\/+$/g, "")}/` : "/";
};

const htmlFiles = (await files(root)).filter((file) => file.endsWith(".html"));
const problems = [];
let links = 0;
let images = 0;
const titles = new Map();
const descriptions = new Map();
const incoming = new Map();

for (const file of htmlFiles) {
  const $ = load(await readFile(file, "utf8"));
  const route = routeForFile(file);
  const title = $("title").text().trim();
  const description = $("meta[name=description]").attr("content")?.trim();
  const robots = $("meta[name=robots]").attr("content");
  const canonical = $("link[rel=canonical]").attr("href");

  if (title) titles.set(title, [...(titles.get(title) || []), route]);
  if (description)
    descriptions.set(description, [
      ...(descriptions.get(description) || []),
      route,
    ]);

  $("script,style").remove();
  if ($("h1").length !== 1) problems.push({ file, issue: "h1-count" });
  if (/[—*]/.test($("body").text()))
    problems.push({ file, issue: "copy-punctuation" });
  if (!description) problems.push({ file, issue: "missing-description" });
  if (
    description &&
    (/^(previous|next)/i.test(description) ||
      /complete list of states and cities|forminator_form/i.test(description))
  )
    problems.push({ file, issue: "boilerplate-description" });

  if (/^\/service-areas\/[^/]+\/[^/]+\/$/.test(route)) {
    const cityLinks = $(".region-city-link-grid a[href]").toArray();
    const serviceLinks = $(".region-service-links a[href]").toArray();
    const relatedLinks = $(".region-nearby-links a[href]").toArray();
    const parentLinks = $(".region-parent-state a[href]").toArray();
    const contextualLinks =
      cityLinks.length +
      serviceLinks.length +
      relatedLinks.length +
      parentLinks.length;
    if (cityLinks.length < 4 || cityLinks.length > 8)
      problems.push({
        file,
        issue: "regional-city-link-count",
        value: cityLinks.length,
      });
    if (serviceLinks.length !== 4)
      problems.push({
        file,
        issue: "regional-service-link-count",
        value: serviceLinks.length,
      });
    if (
      relatedLinks.length !== 3 ||
      new Set(relatedLinks.map((link) => $(link).attr("href"))).size !== 3
    )
      problems.push({
        file,
        issue: "regional-related-link-count",
        value: relatedLinks.length,
      });
    if (parentLinks.length !== 1)
      problems.push({
        file,
        issue: "regional-parent-link-count",
        value: parentLinks.length,
      });
    if (contextualLinks < 12 || contextualLinks > 16)
      problems.push({
        file,
        issue: "regional-contextual-link-count",
        value: contextualLinks,
      });
    for (const link of cityLinks) {
      const href = $(link).attr("href") || "";
      const url = new URL(href, site.origin);
      const reviewedCityLink =
        url.pathname.startsWith(route) &&
        url.pathname !== `${route}cities/` &&
        registeredPages.has(url.pathname) &&
        !url.search;
      if (!reviewedCityLink && !url.searchParams.get("location"))
        problems.push({ file, issue: "regional-city-link-location", href });
    }
    if (/click here/i.test($(".region-page").text()))
      problems.push({ file, issue: "generic-regional-anchor-text" });
  }

  const indexable =
    registry.mode === "production" && registeredPages.get(route)?.indexable;
  const expectedRobots =
    route === "/404/"
      ? "noindex,nofollow"
      : indexable
        ? "index,follow"
        : "noindex,follow";
  if (robots !== expectedRobots)
    problems.push({ file, issue: "robots", value: robots, expectedRobots });
  const expectedCanonical = indexable
    ? new URL(route, site.origin).href
    : undefined;
  if (canonical !== expectedCanonical)
    problems.push({
      file,
      issue: "canonical",
      value: canonical,
      expectedCanonical,
    });

  for (const selector of [
    "meta[property='og:title']",
    "meta[property='og:description']",
    "meta[property='og:type']",
    "meta[property='og:site_name']",
    "meta[property='og:locale']",
    "meta[name='twitter:card']",
    "meta[name='twitter:title']",
    "meta[name='twitter:description']",
  ]) {
    if (!$(selector).attr("content"))
      problems.push({ file, issue: "missing-social-metadata", selector });
  }

  for (const element of $("a[href],img[src]").toArray()) {
    const value = $(element).attr(element.name === "img" ? "src" : "href");
    if (!value || /^(tel:|mailto:|#)/i.test(value)) continue;
    if (
      element.name === "a" &&
      ($(element).attr("rel") || "").split(/\s+/).includes("external")
    )
      continue;
    let url;
    try {
      url = new URL(value, site.origin);
    } catch {
      continue;
    }
    if (
      ![
        new URL(site.origin).hostname,
        "temporary123.com",
        "www.temporary123.com",
      ].includes(url.hostname)
    )
      continue;
    const clean = decodeURIComponent(url.pathname);
    const target = resolve(root, `.${clean}`);
    let valid = false;
    try {
      const info = await stat(target);
      valid =
        info.isFile() || (await stat(resolve(target, "index.html"))).isFile();
    } catch {}
    if (!valid) {
      if (knownMissing.has(clean)) {
        pendingMigrationLinks.set(
          clean,
          (pendingMigrationLinks.get(clean) || 0) + 1,
        );
      } else problems.push({ file, issue: "missing-local-destination", value });
    }
    if (element.name === "a" && redirectSources.has(clean))
      problems.push({ file, issue: "internal-link-to-redirect", value });
    if (element.name === "a" && valid) {
      const linkedRoute = clean.endsWith("/") ? clean : `${clean}/`;
      incoming.set(linkedRoute, (incoming.get(linkedRoute) || 0) + 1);
    }
    element.name === "img" ? images++ : links++;
  }
}

for (const [title, routes] of titles)
  if (routes.length > 1)
    problems.push({ issue: "duplicate-title", value: title, routes });
for (const [description, routes] of descriptions)
  if (routes.length > 1)
    problems.push({
      issue: "duplicate-description",
      value: description,
      routes,
    });
for (const file of htmlFiles) {
  const route = routeForFile(file);
  if (route !== "/" && route !== "/404/" && !incoming.get(route))
    problems.push({ file, issue: "orphan-page", route });
}

const robotsText = await readFile(resolve(root, "robots.txt"), "utf8");
if (!/User-agent: \*\s+Allow: \/\s+Disallow: \/api\//.test(robotsText))
  problems.push({ issue: "robots-policy" });
const sitemapText = await readFile(resolve(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1].replaceAll("&amp;", "&"),
);
const expectedSitemapUrls = registry.pages
  .filter((page) => registry.mode === "production" && page.indexable)
  .map((page) => new URL(page.path, site.origin).href);
if (
  sitemapUrls.length !== expectedSitemapUrls.length ||
  sitemapUrls.some((url, index) => url !== expectedSitemapUrls[index])
)
  problems.push({
    issue: "sitemap-coverage",
    actual: sitemapUrls.length,
    expected: expectedSitemapUrls.length,
  });
if (
  registry.mode === "production" &&
  !robotsText.includes(`Sitemap: ${site.origin}/sitemap.xml`)
)
  problems.push({ issue: "robots-sitemap-reference" });

const report = {
  checkedAt: new Date().toISOString(),
  htmlPages: htmlFiles.length,
  localLinks: links,
  localImages: images,
  uniqueTitles: titles.size,
  uniqueDescriptions: descriptions.size,
  linkedRoutes: incoming.size,
  problems,
  pendingMigrationLinks: [...pendingMigrationLinks].map(([path, links]) => ({
    path,
    links,
  })),
  restoredAssets: registry.restoredAssets?.length || 0,
  migration: JSON.parse(
    await readFile("content/migration-status.json", "utf8"),
  ),
  launchReady: registry.mode === "production" && problems.length === 0,
  indexing:
    registry.mode === "production"
      ? `${expectedSitemapUrls.length} approved routes emit index,follow, self-canonicals and sitemap entries. Other routes remain noindex.`
      : "This build remains excluded from indexing.",
};
await writeFile(
  "audit/homepage-revision-check.json",
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify({ ...report, problems: problems.slice(0, 10) }));
if (problems.length) process.exitCode = 1;
