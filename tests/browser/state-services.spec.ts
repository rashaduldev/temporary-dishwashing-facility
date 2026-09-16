import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { stateGuides } from "../../src/stateGuides";

const allServiceNames = [
  "Mobile Kitchens",
  "Dishwashing",
  "Refrigeration",
  "Shower",
  "Restroom",
  "Shower and Restroom Combination Trailers",
  "Sleeper",
  "Laundry",
  "Handwashing Trailers",
];

const stateModalNames = [
  "Mobile commercial kitchen rentals",
  "Shower and restroom combination trailers",
  "22 ft shower trailer rental, 10 stalls",
  "Sleeper and bunkbed trailer rentals",
  "Dishwashing trailer rentals",
  "Refrigeration trailer rentals",
  "Restroom trailer rentals",
  "Laundry trailer rentals",
  "Handwashing trailer rentals",
];

test("every state guide uses natural rental, rent and lease language", () => {
  expect(Object.keys(stateGuides)).toHaveLength(50);
  expect(
    new Set(Object.values(stateGuides).map((guide) => guide.intro)).size,
  ).toBe(50);
  expect(
    new Set(Object.values(stateGuides).map((guide) => guide.image)).size,
  ).toBe(50);
  expect(
    new Set(
      Object.values(stateGuides).map((guide) =>
        guide.gallery.map((item) => item.image).join("|"),
      ),
    ).size,
  ).toBe(50);
  expect(
    new Set(Object.values(stateGuides).map((guide) => guide.abbreviation)).size,
  ).toBe(50);
  expect(
    new Set(
      Object.values(stateGuides).map(
        (guide) => `${guide.layout}:${guide.motion}`,
      ),
    ).size,
  ).toBe(50);
  for (const [name, guide] of Object.entries(stateGuides)) {
    const stateMentions =
      guide.intro.toLowerCase().split(name.toLowerCase()).length - 1;
    expect(stateMentions, name).toBe(2);
    expect(guide.intro, name).toMatch(/\btemporary\b/i);
    expect(guide.intro, name).toMatch(/\brental\b/i);
    expect(guide.intro, name).toMatch(/\brent\b/i);
    expect(guide.intro, name).toMatch(/\blease\b/i);
    expect(guide.intro, name).toContain(name);
    expect(guide.imageAlt.length, name).toBeGreaterThan(24);
    expect(guide.gallery, name).toHaveLength(3);
    expect(guide.regions.length, name).toBeGreaterThanOrEqual(3);
    expect(guide.fact, name).toMatch(/state capital\.$/);
    expect(guide.serviceSummary, name).toMatch(/base camp/i);
    expect(guide.serviceSummary, name).toMatch(/kitchen/i);
    expect(guide.serviceSummary, name).toMatch(/shower/i);
    expect(guide.serviceSummary, name).toMatch(/sleeper|bunkbed/i);
    expect(existsSync(`public${guide.image}`), `${name}: ${guide.image}`).toBe(
      true,
    );
    for (const item of guide.gallery) {
      expect(item.imageAlt.length, `${name}: ${item.image}`).toBeGreaterThan(
        24,
      );
      expect(existsSync(`public${item.image}`), `${name}: ${item.image}`).toBe(
        true,
      );
    }
  }
});

test("state click opens localized service choices and a direct call action", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/service-areas/#service-area-map");
  expect(
    await page
      .locator("#services-panel .service-category-link")
      .evaluateAll((items) =>
        items.map((item) => item.firstChild?.textContent?.trim()),
      ),
  ).toEqual(allServiceNames);
  const state = page.locator('.coverage-map-stage [data-state="California"]');
  await state.click();
  const modal = page.getByRole("dialog", {
    name: /California Rental Services/,
  });
  await expect(modal).toBeVisible();
  await expect(modal.locator("[data-state-code]")).toHaveText("State 05 of 50");
  await expect(modal).toHaveAttribute("data-state-theme", "4");
  await expect(modal).toHaveAttribute("data-state-layout", "4");
  await expect(modal).toHaveAttribute("data-state-motion", "4");
  await expect(modal.locator("img[data-state-image]")).toHaveAttribute(
    "src",
    stateGuides.California.image,
  );
  await expect(modal.locator("img[data-state-image]")).toHaveAttribute(
    "alt",
    stateGuides.California.imageAlt,
  );
  await expect(modal.locator("img[data-state-image]")).toBeVisible();
  await expect(modal.locator("img[data-state-gallery-image]")).toHaveCount(2);
  await expect(modal.locator("[data-state-regions]")).toContainText(
    "Central Valley",
  );
  await expect(modal.locator("[data-state-fact]")).toHaveText(
    "Sacramento is the state capital.",
  );
  await expect(modal.locator("[data-state-services-copy]")).toContainText(
    "Base camp",
  );
  expect(
    await modal
      .locator("img[data-state-image]")
      .evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
  ).toBe(true);
  await expect(modal.locator("[data-state-initials]")).toHaveText("CA");
  await expect(modal.locator(".state-dialog-visual")).toHaveCSS(
    "animation-name",
    "state-visual-tilt",
  );
  await expect(
    modal.locator(".state-service-list a > span:nth-child(2)"),
  ).toHaveText(stateModalNames);
  await expect(
    modal.getByRole("link", { name: "Dishwashing", exact: false }),
  ).toHaveAttribute("href", "/portable-dishwashing-trailer-rental/");
  const stateIntro = await modal.locator("#state-services-intro").innerText();
  expect(stateIntro).toMatch(/\btemporary\b/i);
  expect(stateIntro).toMatch(/\brental\b/i);
  expect(stateIntro).toMatch(/\brent\b/i);
  expect(stateIntro).toMatch(/\blease\b/i);
  await expect(
    modal.getByRole("link", { name: "Call now", exact: false }),
  ).toHaveAttribute("href", "tel:+18004435212");
  const countryReferences = (
    (await modal.innerText()).match(/\b(?:USA|United States)\b/g) || []
  ).length;
  expect(countryReferences).toBeGreaterThanOrEqual(1);
  expect(countryReferences).toBeLessThanOrEqual(7);
  await page.screenshot({ path: "test-results/state-services-desktop.png" });
  await page.keyboard.press("Escape");
  await expect(state).toBeFocused();
  await state.press("Enter");
  await expect(modal).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(state).toBeFocused();
});

test("different states receive different structures, owned images and motions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/service-areas/#service-area-map");
  const california = page.locator(
    '.coverage-map-stage [data-state="California"]',
  );
  await california.click();
  const dialog = page.locator("#state-services-dialog");
  const firstPresentation = await dialog.evaluate((element) => ({
    layout: element.getAttribute("data-state-layout"),
    motion: element.getAttribute("data-state-motion"),
    image: element.querySelector("img[data-state-image]")?.getAttribute("src"),
  }));
  await page.keyboard.press("Escape");
  await page.locator('.coverage-map-stage [data-state="Montana"]').click();
  const secondPresentation = await dialog.evaluate((element) => ({
    layout: element.getAttribute("data-state-layout"),
    motion: element.getAttribute("data-state-motion"),
    image: element.querySelector("img[data-state-image]")?.getAttribute("src"),
  }));
  expect(secondPresentation).not.toEqual(firstPresentation);
  expect(secondPresentation).toEqual({
    layout: stateGuides.Montana.layout,
    motion: stateGuides.Montana.motion,
    image: stateGuides.Montana.image,
  });
  await expect(dialog.locator(".state-dialog-visual")).toHaveCSS(
    "animation-name",
    "state-visual-reveal",
  );
});

test("mobile state selection and expanded map support keyboard, calling and dismissal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/service-areas/#service-area-map");
  await page.locator("[data-state-picker]").selectOption("New Hampshire");
  let modal = page.getByRole("dialog", {
    name: /New Hampshire Rental Services/,
  });
  await expect(modal).toBeVisible();
  expect(await modal.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(
    true,
  );
  await expect(
    modal.getByRole("link", { name: "Call now", exact: false }),
  ).toHaveAttribute("href", "tel:+18004435212");
  await page.screenshot({ path: "test-results/state-services-mobile.png" });
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Explore full map" }).click();
  const state = page.locator('.map-dialog [data-state="Texas"]');
  await state.focus();
  await state.press("Space");
  modal = page.getByRole("dialog", {
    name: /Texas Rental Services/,
  });
  await expect(modal).toBeVisible();
  await expect(modal.locator(".state-dialog-visual")).toHaveCSS(
    "animation-name",
    "none",
  );
  await page.keyboard.press("Escape");
  await expect(state).toBeFocused();
  await state.press("Enter");
  await expect(
    modal.getByRole("link", { name: "Call now", exact: false }),
  ).toHaveAttribute("href", "tel:+18004435212");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await expect(page.locator(".map-dialog")).not.toBeVisible();
  await expect(page.locator("[data-expand-map]")).toBeFocused();
});
