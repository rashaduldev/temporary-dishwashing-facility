import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`state, regional and city rental views at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [
      "/service-areas/california/",
      "/service-areas/washington/olympic-peninsula/",
      "/service-areas/new-york/new-york-city-and-long-island/",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveText(/(Rental|Lease|Facilities)/);
      expect((await page.locator("h1").innerText()).length).toBeLessThanOrEqual(
        75,
      );
      await expect(
        page.getByRole("heading", {
          name: "Rental Planning Conditions",
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.locator("main")).not.toContainText(
        "delivery planning timeline",
      );
      await expect(page.locator("main img")).toHaveCount(3);
      for (const image of await page.locator("main img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate(
              (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
            ),
          )
          .toBe(true);
        const ratio = await image.evaluate((el: HTMLImageElement) =>
          Math.abs(
            el.clientWidth / el.clientHeight -
              el.naturalWidth / el.naturalHeight,
          ),
        );
        expect(ratio).toBeLessThan(0.02);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.goto("/service-areas/");
    await expect(page.locator(".coverage-map")).toHaveCount(1);
    await page.locator("[data-state-picker]").selectOption("California");
    const dialog = page.locator("#state-services-dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("#state-services-title")).toContainText(
      "California Rental Services",
    );
    await expect(dialog.locator("img")).toHaveCount(3);
    await expect(dialog.locator("[data-state-page]")).toHaveAttribute(
      "href",
      "/service-areas/california/",
    );
    await expect(dialog.locator("[data-state-regions] a")).toHaveCount(6);
    expect(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await page.locator("[data-state-picker]").selectOption("Washington");
    await expect(dialog.locator("[data-state-cities]")).toBeVisible();
    await expect(
      dialog.locator('[data-map-city-state="Washington"] a'),
    ).toHaveCount(5);
    await expect(
      dialog.locator('[data-map-city-state="Washington"] a').first(),
    ).toHaveAttribute("href", /^\/service-areas\/washington\/.+\/$/);
    await page.keyboard.press("Escape");
    await page.goto("/service-areas/washington/olympic-peninsula/");
    await page.locator(".region-city-link-grid a").first().click();
    await expect(page.locator("main h1")).toHaveText(
      /^Port Angeles, Washington /,
    );
    await expect(page.locator("main h1")).toHaveText(
      /(Rental|Lease|Facilities)/,
    );
    await expect(page.locator("main img:visible")).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto(
      "/equipment-rental/mobile-kitchen-trailers/?location=Boise%2C%20Idaho",
    );
    await expect(page.locator("main h1")).toHaveText(/^Boise, Idaho /);
    await expect(page.locator("main h1")).toHaveText(
      /Kitchen.*(Rental|Lease)$/,
    );
  });
}

for (const width of [390, 1440]) {
  test(`four industry rental destinations at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of [
      "/man-camps-for-rent/",
      "/food-services-2/",
      "/government/",
      "/disaster-relief-man-camp-workforce-rentals/",
    ]) {
      const failures: string[] = [];
      page.on("pageerror", (error) => failures.push(error.message));
      await page.goto(path);
      await expect(page.locator("h1")).toHaveText(/(Rental|Lease|Facilities)/);
      expect((await page.locator("h1").innerText()).length).toBeLessThanOrEqual(
        75,
      );
      await expect(page.locator("main img")).toHaveCount(3);
      await expect(page.locator(".industry-services li")).toHaveCount(9);
      for (const img of await page.locator("main img").all()) {
        await img.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            img.evaluate(
              (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
            ),
          )
          .toBe(true);
        expect(
          await img.evaluate((el: HTMLImageElement) =>
            Math.abs(
              el.clientWidth / el.clientHeight -
                el.naturalWidth / el.naturalHeight,
            ),
          ),
        ).toBeLessThan(0.02);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const words = (await page.locator("main").innerText()).split(
        /\s+/,
      ).length;
      expect(words).toBeGreaterThanOrEqual(250);
      expect(words).toBeLessThanOrEqual(500);
      expect(failures).toEqual([]);
    }
    await page.locator(".contact-rail").click();
    await expect(page.locator("#contact-drawer")).toBeVisible();
    await expect(page.locator("#quote-island")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#contact-drawer")).not.toBeVisible();
  });
}
