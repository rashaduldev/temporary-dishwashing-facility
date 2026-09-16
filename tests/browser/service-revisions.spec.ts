import { test, expect } from "@playwright/test";
import details from "../../content/service-details.json" with { type: "json" };
import deployment from "../../vercel.json" with { type: "json" };

test("Services stays selected across pointer gaps and closes only on outside click or Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const trigger = page.locator(".services-trigger"),
    menu = page.locator("#services-panel");
  await trigger.hover();
  await expect(menu).not.toBeVisible();
  await trigger.click();
  await expect(menu).toBeVisible();
  await menu.getByRole("button", { name: "Dishwashing", exact: true }).click();
  await page.mouse.move(500, 1000);
  await expect(menu).toBeVisible();
  const model = menu.getByRole("link", { name: "22ft Dishwashing Trailer" });
  await model.hover();
  await expect(menu.locator(".service-category[open]")).toContainText(
    "Dishwashing",
  );
  await model.click();
  await expect(page).toHaveURL(/dishwashing-trailers\/22ft\/$/);
  await expect(page.locator("h1")).toHaveText(
    "22ft Dishwashing Trailer Rental",
  );
  await trigger.click();
  await menu.getByRole("button", { name: "Dishwashing", exact: true }).click();
  await menu.getByRole("link", { name: "26ft Dishwashing Trailer" }).click();
  await expect(page).toHaveURL(/dishwashing-trailers\/26ft\/$/);
  await trigger.click();
  await page.mouse.click(20, 250);
  await expect(menu).not.toBeVisible();
  await trigger.focus();
  await page.keyboard.press("Space");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("all service model destinations have equipment, planning, source and descriptive metadata", async ({
  request,
}) => {
  for (const [path, item] of Object.entries(details)) {
    const redirect = deployment.redirects.find((rule) => rule.source === path);
    if (redirect) {
      const moved = await request.get(path, { maxRedirects: 0 });
      expect(moved.status(), path).toBe(308);
      expect(
        new URL(moved.headers().location, "http://localhost:4173").pathname,
      ).toBe(redirect.destination);
      expect(
        (await request.get(redirect.destination)).status(),
        redirect.destination,
      ).toBe(200);
      continue;
    }
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).toContain("What this option offers");
    expect(html, path).toContain("Confirm with your quote");
    expect(html, path).toContain(item.source);
    expect(html, path).toContain('class="model-features"');
    expect(html, path).not.toContain("rental planning from Temporary123");
  }
  const small = await (
    await request.get("/services/dishwashing-trailers/22ft/")
  ).text();
  expect(small).not.toContain("Conveyor system for moving dishes");
  const conveyor = await (
    await request.get("/services/dishwashing-trailers/38ft-conveyor/")
  ).text();
  expect(conveyor).toContain("Conveyor system for moving dishes");
  const shared = await (
    await request.get("/services/mobile-sleeper-trailers/20ft-shared/")
  ).text();
  expect(shared).not.toContain("Private bathroom and kitchenette");
});

for (const width of [390, 1440])
  test(`geographic map and model page work under CSP at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto("/service-areas/#service-area-map");
    await expect(
      page.locator(".coverage-map-stage .map-land path"),
    ).toHaveCount(50);
    await expect(
      page.locator(".coverage-map-stage .map-labels text"),
    ).toHaveCount(50);
    const calloutLabels = page.locator(".coverage-map-stage .map-callout text");
    await expect(calloutLabels).toHaveCount(8);
    expect(await calloutLabels.allTextContents()).toEqual(
      expect.arrayContaining([
        "Connecticut",
        "Delaware",
        "Massachusetts",
        "Maryland",
        "New Hampshire",
        "New Jersey",
        "Rhode Island",
        "Vermont",
      ]),
    );
    await page.getByRole("button", { name: "Explore full map" }).click();
    const dialog = page.getByRole("dialog", {
      name: "USA service coverage map",
    });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.locator("text").filter({ hasText: "California" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await page.goto("/services/dishwashing-trailers/22ft/");
    await expect(page.locator(".model-hero img")).toHaveJSProperty(
      "complete",
      true,
    );
    expect(
      await page
        .locator(".model-hero img")
        .evaluate((i: HTMLImageElement) => i.naturalWidth),
    ).toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `test-results/model-detail-${width}.png`,
      fullPage: true,
    });
  });

for (const width of [390, 1440])
  test(`contact emphasis respects motion preferences at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const phone = page.locator(
      width < 1024 ? ".mobile-call" : ".header-contact",
    );
    const rail = page.locator(".contact-rail");
    await expect(phone).toHaveCSS("animation-name", "none");
    await expect(rail).toHaveCSS(
      "animation-name",
      width <= 767 ? "none" : "support-contact-glow",
    );
    if (width > 767) {
      const duration = await rail.evaluate((element) =>
        parseFloat(getComputedStyle(element).animationDuration),
      );
      expect(duration).toBeGreaterThanOrEqual(3);
    }
    for (const control of [phone, rail]) {
      await expect(control).toBeVisible();
      await expect(control).toHaveCSS("opacity", "1");
    }
    const status = page.locator(".utility-status i");
    const statusMotion = await status.evaluate((element) => {
      const styles = getComputedStyle(element, "::after");
      return {
        name: styles.animationName,
        duration: parseFloat(styles.animationDuration),
      };
    });
    expect(statusMotion.name).toBe("support-status-breathe");
    expect(statusMotion.duration).toBeGreaterThanOrEqual(1);
    expect(statusMotion.duration).toBeLessThan(2);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const control of [phone, rail])
      await expect(control).toHaveCSS("animation-name", "none");
    expect(
      await status.evaluate(
        (element) => getComputedStyle(element, "::after").animationName,
      ),
    ).toBe("none");
  });

test("Services and category selection work before JavaScript loads", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.locator(".services-trigger").click();
  await page
    .locator("#services-panel")
    .getByRole("button", { name: "Dishwashing", exact: true })
    .click();
  await page
    .locator("#services-panel")
    .getByRole("link", { name: "22ft Dishwashing Trailer" })
    .click();
  await expect(page).toHaveURL(/dishwashing-trailers\/22ft\/$/);
  await expect(page.locator("h1")).toHaveText(
    "22ft Dishwashing Trailer Rental",
  );
  await context.close();
});
