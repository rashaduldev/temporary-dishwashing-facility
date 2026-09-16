import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`both maps and homepage preview at ${width}`, async ({
    page,
    browser,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/service-areas/"]) {
      await page.goto(route);
      if (route === "/service-areas/") {
        const copy = await page.locator(".location-hero-copy").boundingBox();
        const map = await page.locator(".location-hero-map").boundingBox();
        expect(copy).not.toBeNull();
        expect(map).not.toBeNull();
        if (width >= 1200)
          expect(map!.x).toBeGreaterThanOrEqual(copy!.x + copy!.width);
        else expect(map!.y).toBeGreaterThanOrEqual(copy!.y + copy!.height);
        await page
          .locator(".location-hero")
          .screenshot({ path: `test-results/service-area-hero-${width}.png` });
      }
      await expect(
        page.locator(".coverage-map-stage [data-state]"),
      ).toHaveCount(50);
      await expect(page.locator(".map-location-state")).toHaveCount(50);
      await expect(page.locator("[data-directory-city]")).toHaveCount(5);
      await page.locator("[data-state-picker]").selectOption("Texas");
      const dialog = page.locator("#state-services-dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog.locator("[data-state-page]")).toHaveAttribute(
        "href",
        "/service-areas/texas/",
      );
      if (route === "/") {
        await expect(dialog.locator(".state-dialog-seasonal")).toHaveCount(0);
        await dialog.screenshot({
          path: `test-results/home-map-preview-${width}.png`,
        });
      } else
        await expect(dialog.locator(".state-dialog-seasonal")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 900 },
    });
    const plain = await context.newPage();
    for (const route of ["/", "/service-areas/"]) {
      await plain.goto(new URL(route, page.url()).href);
      await expect(plain.locator(".map-location-state")).toHaveCount(50);
      await plain
        .getByText("Regions and cities in Washington", { exact: true })
        .click();
      await expect(
        plain.locator("[data-directory-city]").first(),
      ).toBeVisible();
      await plain.locator("[data-directory-city]").first().click();
      await expect(plain.locator("h1")).toContainText("Washington");
    }
    await context.close();
  });
}
