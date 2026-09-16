import { test, expect } from "@playwright/test";
import { serviceCategories } from "../../src/serviceMenu";
import {
  rentalCategoryHeadline,
  rentalProductHeadline,
} from "../../src/rentalHeadlines";
import details from "../../content/service-details.json" with { type: "json" };
import catalog from "../../content/equipment-catalog.json" with { type: "json" };

test("all 25 equipment entries and legacy destinations resolve", async ({
  request,
}) => {
  for (const item of catalog.items) {
    const page = await request.get(item.path);
    expect(page.status(), item.path).toBe(200);
    expect(await page.text()).toContain("Temporary123");
    const redirect = await request.get(item.legacyPath, { maxRedirects: 0 });
    expect(redirect.status(), item.legacyPath).toBe(308);
    expect(redirect.headers().location).toBe(item.path);
    const image = await request.get(item.image);
    expect(image.status(), item.image).toBe(200);
  }
});

for (const width of [320, 390, 768, 1440]) {
  test(`equipment catalog layout, images and search at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/equipment-rental/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("[data-catalog-card]")).toHaveCount(25);
    for (const photo of await page.locator(".catalog-media img").all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect(photo).toHaveJSProperty("complete", true);
      expect(
        await photo.evaluate((i: HTMLImageElement) => i.naturalWidth),
      ).toBeGreaterThan(0);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("searchbox", { name: "Find equipment" })
      .fill("laundry");
    await expect(page.locator("[data-catalog-card]:visible")).toHaveCount(1);
    await expect(page.locator("#equipment-search-status")).toHaveText(
      "1 equipment entry",
    );
    await page
      .getByRole("searchbox", { name: "Find equipment" })
      .fill("no-such-equipment");
    await expect(page.locator(".catalog-empty")).toBeVisible();
    await page.getByRole("button", { name: "Show all equipment" }).click();
    await expect(page.locator("[data-catalog-card]:visible")).toHaveCount(25);
    expect(errors).toEqual([]);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `test-results/equipment-${width}.png`,
      fullPage: true,
    });
  });
}

test("equipment briefs remain readable and connected on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  const briefs = catalog.items.filter(
    (item, index) =>
      catalog.items.findIndex((candidate) => candidate.path === item.path) ===
      index,
  );
  for (const item of briefs) {
    await page.goto(item.path);
    const detail = details[item.path as keyof typeof details];
    const category = serviceCategories.find((c) => c.href === item.path);
    await expect(page.locator("h1")).toHaveText(
      detail
        ? rentalProductHeadline(detail.name)
        : category
          ? rentalCategoryHeadline(category.name)
          : rentalProductHeadline(item.name),
    );
    await expect(
      page.locator("main a[href='tel:+18004435212']").first(),
    ).toHaveAttribute("href", "tel:+18004435212");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      item.path,
    ).toBe(true);
    expect(
      await page
        .locator(
          "main a[href^='/equipment-rental/'],main a[href^='/services/']",
        )
        .count(),
    ).toBeGreaterThanOrEqual(2);
  }
});
