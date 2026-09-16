import { mkdir, readFile, writeFile } from "node:fs/promises";
import { renderToString } from "react-dom/server";
import site from "../site.json" with { type: "json" };
import { routes, pageInfo } from "../src/content";
import { pilotUrlMap } from "../src/dishwashingContent";
import { Site } from "../src/Site";

const source = await readFile("dist/index.html", "utf8");
const deploymentIsProduction = process.env.VERCEL_ENV === "production";
const release =
  site.mode === "production" &&
  site.domainRoutingReady === true &&
  site.legacyUrlInventoryComplete === true &&
  site.dashboardAuthReady === true &&
  site.calculatorPricingApproved === true &&
  deploymentIsProduction;

const routeRecords = new Map(
  pilotUrlMap.map((entry) => [entry.path, entry] as const),
);
const allRoutes = [
  ...new Set([...routes, ...pilotUrlMap.map((entry) => entry.path)]),
];

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const canonicalFor = (path: string) =>
  new URL(path, site.origin.endsWith("/") ? site.origin : `${site.origin}/`).toString();

const schemaFor = (path: string, title: string, description: string) => {
  const common = {
    "@context": "https://schema.org",
    name: title,
    description,
    url: canonicalFor(path),
  };
  if (path === "/") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: site.brand,
          url: site.origin,
          telephone: site.phoneE164,
        },
        { "@type": "WebSite", ...common },
      ],
    };
  }
  if (/dishwashing-trailer-rental\/$/.test(path)) {
    return { "@type": "Service", ...common, serviceType: "Temporary commercial dishwashing facility rental" };
  }
  return { "@type": "WebPage", ...common };
};

const registry: Array<{
  path: string;
  status: number;
  canonical: string | null;
  indexable: boolean;
  indexingPlan: string;
}> = [];

for (const path of [...allRoutes, "/404/"]) {
  const is404 = path === "/404/";
  const record = routeRecords.get(path);
  const isPrivate = record?.kind === "private" || path.startsWith("/seo/dashboard/");
  const info = is404
    ? {
        title: `Page not found | ${site.brand}`,
        description: "The requested page could not be found.",
      }
    : pageInfo(path);
  const canonical = is404 || isPrivate ? null : canonicalFor(path);
  const plannedForIndex =
    record?.indexing === "index-when-production-approved";
  const indexable = release && plannedForIndex && !isPrivate;
  const robots = is404
    ? "noindex,nofollow"
    : indexable
      ? "index,follow"
      : "noindex,follow";

  const head = [
    `<meta name="description" content="${escapeHtml(info.description)}">`,
    `<meta property="og:title" content="${escapeHtml(info.title)}">`,
    `<meta property="og:description" content="${escapeHtml(info.description)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${escapeHtml(site.brand)}">`,
    `<meta name="twitter:card" content="summary">`,
    canonical
      ? `<link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:url" content="${escapeHtml(canonical)}">`
      : "",
    !is404
      ? `<script type="application/ld+json">${JSON.stringify(schemaFor(path, info.title, info.description)).replace(/</g, "\\u003c")}</script>`
      : "",
  ].join("");

  const html = source
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(info.title)}</title>`)
    .replace(
      /<meta name="robots" content="[^"]*"\s*\/?\s*>/,
      `<meta name="robots" content="${robots}" />`,
    )
    .replace("<!--page-head-->", head)
    .replace("<!--app-html-->", renderToString(<Site path={is404 ? "/404/" : path} />));

  const destination = is404 ? "dist/404.html" : `dist${path}index.html`;
  await mkdir(destination.slice(0, destination.lastIndexOf("/")), {
    recursive: true,
  });
  await writeFile(destination, html);
  registry.push({
    path,
    status: is404 ? 404 : 200,
    canonical,
    indexable,
    indexingPlan: record?.indexing || "noindex",
  });
}

const indexableRoutes = registry.filter((entry) => entry.indexable);
const sitemap = release
  ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexableRoutes.map((entry) => `  <url><loc>${escapeHtml(canonicalFor(entry.path))}</loc></url>`).join("\n")}\n</urlset>\n`
  : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n`;

await writeFile("dist/sitemap.xml", sitemap);
await writeFile(
  "dist/robots.txt",
  release
    ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /seo/dashboard/\nSitemap: ${site.origin}/sitemap.xml\n`
    : "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /seo/dashboard/\n# Preview pages carry noindex until the production release is approved.\n",
);
await mkdir("audit", { recursive: true });
await writeFile(
  "audit/build-registry.json",
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      mode: release ? "production" : "preview-noindex",
      origin: site.origin,
      releaseGates: {
        productionMode: site.mode === "production",
        productionDeployment: deploymentIsProduction,
        domainRoutingReady: site.domainRoutingReady,
        legacyUrlInventoryComplete: site.legacyUrlInventoryComplete,
        dashboardAuthReady: site.dashboardAuthReady,
        calculatorPricingApproved: site.calculatorPricingApproved,
      },
      routes: registry,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `Static HTML generated for ${allRoutes.length} pages + 404 (${release ? "production" : "preview/noindex"}).`,
);
