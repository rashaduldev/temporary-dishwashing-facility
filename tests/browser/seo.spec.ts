import { test, expect } from "@playwright/test";
import routes from "../../content/route-index.json" with { type: "json" };
import catalog from "../../content/equipment-catalog.json" with { type: "json" };
import backlinks from "../../audit/backlink-reconciliation.json" with { type: "json" };
import vercel from "../../vercel.json" with { type: "json" };

const core = [
  "/",
  "/services/",
  "/industries/",
  "/service-areas/",
  "/planning/",
  "/about-us/",
  "/blog/",
  "/contact-us/",
  "/privacy/",
  "/equipment-rental/",
];
const exactRedirects = new Set(
  vercel.redirects
    .filter((rule) => !rule.source.includes(":"))
    .map((rule) => rule.source),
);
const generated = [
  ...new Set([
    ...core,
    ...routes.map((route) => route.path),
    ...catalog.items.map((item) => item.path),
  ]),
].filter((path) => !exactRedirects.has(path));

async function inParallel<T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  concurrency = 8,
) {
  let next = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (next < items.length) await worker(items[next++]);
    }),
  );
}

test("every generated page returns substantive HTML", async ({ request }) => {
  await inParallel(generated, async (path) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain("text/html");
    const html = await response.text();
    expect(html, path).toContain("<main");
    expect(html, path).toContain("Temporary123");
  });
});

test("every known backlink URL reaches a page in one step", async ({
  request,
}) => {
  const paths = [
    ...new Set(backlinks.map((row: { path: string }) => row.path)),
  ];
  await inParallel(paths, async (path) => {
    const first = await request.get(path, { maxRedirects: 0 });
    expect([200, 308], path).toContain(first.status());
    if (first.status() === 308) {
      const destination = first.headers().location;
      expect(destination, path).toBeTruthy();
      const final = await request.get(destination, { maxRedirects: 0 });
      expect(final.status(), `${path} -> ${destination}`).toBe(200);
    }
  });
});
