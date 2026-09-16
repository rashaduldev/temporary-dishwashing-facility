import { test, expect } from "@playwright/test";

const homepageServiceNames = [
  "Mobile kitchen trailers",
  "Dishwashing trailers",
  "Refrigeration trailers",
  "Shower trailers",
  "Restroom trailers",
  "Shower & restroom combinations",
  "Sleeper / Bunkbed Trailers",
  "Laundry trailers",
  "Handwashing trailers",
];

for (const width of [320, 390, 768, 1024, 1280, 1440])
  test(`homepage layout and photos at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText(
      "Temporary Facilities Rental",
    );
    await expect(page.locator("h1")).toContainText("Rent or Lease Nationwide");
    await expect(
      page.getByRole("link", { name: "Find your rental", exact: true }),
    ).toHaveAttribute("href", "#equipment");
    await expect(page).toHaveTitle(/Temporary123/);
    await expect(page.locator(".brand")).toContainText("Temporary123");
    await expect(page.locator(".visual-note, .equipment-jumps")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Prepare for your project" }),
    ).toHaveCount(0);
    const brandMark = page.locator(".brand img");
    const brandText = page.locator(".brand > span");
    expect(
      await brandMark.evaluate(
        (mark, text) => {
          const image = mark as HTMLImageElement;
          const word = text as HTMLElement;
          const visibleMarkHeight =
            image.clientWidth / (image.naturalWidth / image.naturalHeight);
          return (
            visibleMarkHeight / parseFloat(getComputedStyle(word).fontSize)
          );
        },
        await brandText.elementHandle(),
      ),
    ).toBeGreaterThanOrEqual(0.85);
    const supportBar = page.locator(".utility");
    await expect(supportBar).toBeVisible();
    await expect(supportBar).toContainText("Emergency support available 24/7.");
    await expect(supportBar).toHaveCSS("background-color", "rgb(167, 8, 5)");
    await expect(supportBar.locator(".utility-agent-icon")).toBeVisible();
    await expect(supportBar.locator(".utility-specialist")).toBeVisible();
    await expect(supportBar.locator("a")).toHaveAttribute(
      "href",
      "tel:+18004435212",
    );
    await expect(supportBar.locator("a")).toHaveCSS("color", "rgb(167, 8, 5)");
    await expect(supportBar.locator("a")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await expect(page.locator(".utility-status i")).toHaveCSS(
      "background-color",
      "rgb(53, 240, 138)",
    );
    expect(
      await page
        .locator(".utility-status i")
        .evaluate(
          (element) => getComputedStyle(element, "::after").animationName,
        ),
    ).toBe("support-status-breathe");
    const contactRail = page.locator(".contact-rail");
    await expect(contactRail).toBeVisible();
    await expect(contactRail).toHaveAttribute("href", "/contact-us/");
    await expect(contactRail).toHaveCSS("background-color", "rgb(0, 128, 154)");
    await expect(contactRail).toHaveCSS(
      "animation-name",
      width <= 767 ? "none" : "support-contact-glow",
    );
    const railBounds = await contactRail.boundingBox();
    expect(railBounds).not.toBeNull();
    expect(railBounds!.x).toBe(0);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const phone = page.locator(
      width < 1024 ? ".mobile-call" : ".header-contact",
    );
    await expect(phone).toHaveAttribute("href", "tel:+18004435212");
    await expect(phone.locator("strong")).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
    await expect(phone).toHaveCSS("background-color", "rgb(18, 63, 70)");
    await expect(phone.locator(":scope > span")).toHaveText(
      "Call our team, 24/7",
    );
    await expect(phone.locator(":scope > span")).toBeVisible();
    await expect(phone.locator("svg")).toBeVisible();
    if (width >= 1024) {
      await expect(phone).toHaveCSS("border-radius", "12px");
      expect(
        await phone.evaluate(
          (element) => getComputedStyle(element, "::after").animationName,
        ),
      ).toBe("header-call-edge-flicker");
    }
    await expect(phone.locator("strong")).toHaveText("+1 (800) 443 - 5212");
    const displayedPhoneNumbers = await page
      .locator('a[href="tel:+18004435212"]')
      .allTextContents();
    for (const text of displayedPhoneNumbers)
      expect(text.replace(/\s+/g, " ")).toContain("+1 (800) 443 - 5212");
    await expect(phone).toBeInViewport({ ratio: 1 });
    if (width <= 767) {
      const phoneBounds = await phone.boundingBox();
      expect(phoneBounds).not.toBeNull();
      expect(railBounds!.x + railBounds!.width).toBeLessThanOrEqual(
        phoneBounds!.x + 1,
      );
      expect(Math.abs(railBounds!.y - phoneBounds!.y)).toBeLessThanOrEqual(1);
    }
    await page.locator(".faq-section").scrollIntoViewIfNeeded();
    await expect(phone).toBeInViewport({ ratio: 1 });
    for (const photo of await page.locator(".image-box img").all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect(photo).toHaveJSProperty("complete", true);
      expect(
        await photo.evaluate((i: HTMLImageElement) => i.naturalWidth),
      ).toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    expect(
      await page
        .locator(".rental-hero-photo img")
        .evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/temporary123-${width}.png`,
      fullPage: true,
    });
  });
test("mobile menu supports keyboard and Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".mobile-nav > summary").focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await expect(page.locator(".contact-rail")).not.toBeVisible();
  await expect(page.locator(".mobile-call")).not.toBeVisible();
  await page.locator(".mobile-services > summary").click();
  const kitchenCategory = page.locator(".mobile-service-category").first();
  await kitchenCategory.locator("> summary").click();
  await expect(
    kitchenCategory.getByRole("link", { name: "24ft Mobile Kitchen Trailer" }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/services-menu-mobile.png" });
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).not.toBeVisible();
  await expect(page.locator(".contact-rail")).toBeVisible();
  await expect(page.locator(".mobile-call")).toBeVisible();
});

test("desktop services menu exposes clear rental categories", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const trigger = page.locator(".services-trigger");
  await expect(trigger).toContainText("Services");
  await trigger.click();
  const menu = page.getByRole("group", { name: "Services menu" });
  await expect(menu).toBeVisible();
  await expect(menu.locator(".service-category")).toHaveCount(9);
  await expect(
    menu.getByRole("button", { name: "Restroom", exact: true }),
  ).toBeVisible();
  await menu.getByRole("button", { name: "Restroom", exact: true }).click();
  await expect(
    menu.getByRole("link", {
      name: "30 ft Luxury Combination Trailer, 8 Stalls",
    }),
  ).toBeVisible();
  await expect(
    menu.getByRole("button", {
      name: "Sleeper",
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/services-menu-desktop.png" });
});

test("every service model in the desktop menu resolves locally", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.locator(".services-trigger").focus();
  const hrefs = await page
    .locator(".service-category-link, .service-submenu-links a")
    .evaluateAll((links) => [
      ...new Set(
        links.map((link) => link.getAttribute("href")).filter(Boolean),
      ),
    ]);
  expect(hrefs.length).toBeGreaterThanOrEqual(29);
  for (const href of hrefs) {
    const response = await request.get(href as string);
    expect(response.status(), href as string).toBe(200);
  }
});

test("service model pages provide unique planning content", async ({
  page,
}) => {
  await page.goto(
    "/services/shower-restroom-combination-trailers/22ft-6-stall/",
  );
  await expect(page.locator("h1")).toHaveText(
    "22 ft Luxury Shower and Restroom Combination Trailer, 6 Stalls Rental",
  );
  await expect(page).toHaveTitle(
    "22 ft Luxury Shower and Restroom Combination Trailer, 6 Stalls Rental | Temporary123",
  );
  await expect(page.getByText("PLAN BEFORE DELIVERY")).toBeVisible();
});

for (const width of [390, 1440])
  test(`location hero presents nationwide coverage at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/service-areas/");
    await expect(page.locator(".location-hero h1")).toContainText(
      "USA Temporary Facilities Rental Service Areas",
    );
    await expect(page.locator("#project-location")).toBeVisible();
    await expect(
      page.locator(".coverage-map-stage .map-land path"),
    ).toHaveCount(50);
    await expect(page.locator("#coverage-map-title")).toHaveText(
      "Find your state",
    );
    await expect(page.locator(".coverage-map-topline strong")).toHaveText(
      "50 states",
    );
    await expect(
      page.getByLabel("Choose your state", { exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.locator("#service-area-map").screenshot({
      path: `test-results/location-coverage-${width}.png`,
    });
  });

test("desktop navigation follows the requested order", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page.locator(
      ".header > nav > a, .header > nav > .services-nav > .services-trigger",
    ),
  ).toHaveText([
    "Home",
    "Services ⌄",
    "Service Areas",
    "About Us",
    "Articles",
    "Contact Us",
  ]);
});

test("Contact Us opens an in-page project drawer", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const trigger = page.locator('.header > nav a[href="/contact-us/"]');
  await trigger.click();
  await expect(page).toHaveURL(/\/$/);
  const drawer = page.getByRole("dialog", { name: "Contact Us" });
  await expect(drawer).toBeVisible();
  await expect(drawer.locator('input[name="name"]')).toBeVisible();
  await expect(drawer.locator('input[name="startDate"]')).toBeVisible();
  await expect(drawer.locator('select[name="service"]')).toBeVisible();
  await page.waitForTimeout(350);
  await page.screenshot({ path: "test-results/contact-drawer-desktop.png" });
  await drawer.getByRole("button", { name: "Close contact form" }).click();
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("mobile Contact Us tab opens the drawer without navigating", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/equipment-rental/");
  await page.locator(".contact-rail").click();
  await expect(page).toHaveURL(/\/equipment-rental\/$/);
  const drawer = page.getByRole("dialog", { name: "Contact Us" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: /Call:/ })).toContainText(
    "+1 (800) 443 - 5212",
  );
  expect(
    await drawer.evaluate(
      (element) => element.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.waitForTimeout(350);
  await page.screenshot({ path: "test-results/contact-drawer-mobile.png" });
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
});

test("equipment quick view contains focus and restores its trigger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Quick view: Mobile kitchen trailers",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Mobile kitchen trailers",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close quick view" }),
  ).toBeFocused();
  await expect(
    dialog.getByRole("link", { name: "Call now", exact: false }),
  ).toHaveAttribute("href", "tel:+18004435212");
  await expect(
    dialog.getByRole("list", { name: "Rental benefits" }),
  ).toHaveCount(1);
  await expect(dialog.getByRole("listitem")).toHaveCount(3);
  await expect(dialog).toContainText("short-term rental availability");
  await expect(dialog).toContainText("longer-term lease arrangements");
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((e) => e.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator(".mobile-call")).toBeInViewport({ ratio: 1 });
  await trigger.click();
  await dialog.getByRole("button", { name: "Close quick view" }).click();
  await expect(trigger).toBeFocused();
});

test("homepage shows nine rental services with ten distinct equipment photos", async ({
  page,
}) => {
  await page.goto("/");
  const cards = page.locator(".equipment-card");
  await expect(cards).toHaveCount(9);
  await expect(page.locator(".hero-service-strip strong")).toHaveText([
    "Mobile Commercial Kitchen",
    "Shower",
    "Shower & Restroom Combination",
    "Sleeper/Bunkbed Trailers",
  ]);
  await expect(cards.locator("h3")).toHaveText(homepageServiceNames);
  await expect(cards.locator(".card-actions > a")).toHaveCount(9);
  for (const rentalLink of await cards.locator(".card-actions > a").all()) {
    await expect(rentalLink).toContainText("View rental");
    await expect(rentalLink).not.toHaveAttribute("href", /^tel:/);
  }
  await expect(
    cards.getByRole("link", {
      name: "Shower & restroom combinations",
      exact: true,
    }),
  ).toBeVisible();
  const photos = page.locator(".homepage img");
  await expect(photos).toHaveCount(10);
  const sources = await photos.evaluateAll((images) =>
    images.map((image) => image.getAttribute("src")),
  );
  expect(sources.every(Boolean)).toBe(true);
  expect(new Set(sources).size).toBe(10);
  for (const photo of await photos.all())
    await expect(photo).toHaveAttribute("alt", /\S/);
});

for (const width of [390, 1440])
  test(`rental filters show the selected facilities and restore all nine at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page
      .getByRole("link", { name: "Find your rental", exact: true })
      .click();
    await expect(page).toHaveURL(/\/#equipment$/);
    const filters = page.getByRole("group", { name: "Filter rental services" });
    const cards = page.locator("#home-rental-grid .equipment-card");
    const visibleCards = page.locator(
      "#home-rental-grid .equipment-card:visible",
    );
    const status = page.locator("[data-rental-status]");
    await expect(filters).toBeVisible();
    await expect(cards).toHaveCount(9);
    await expect(visibleCards).toHaveCount(9);
    await expect(status).toHaveText("Showing all 9 facilities");
    await expect(
      filters.getByRole("button", { name: /^All facilities/ }),
    ).toHaveAttribute("aria-pressed", "true");
    for (const [label, names] of [
      ["Kitchens & cold storage", homepageServiceNames.slice(0, 3)],
      [
        "Restrooms & hygiene",
        [...homepageServiceNames.slice(3, 6), homepageServiceNames[8]],
      ],
      ["Workforce living", homepageServiceNames.slice(6, 8)],
      ["All facilities", homepageServiceNames],
    ] as const) {
      const button = filters.getByRole("button", {
        name: new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
      });
      await button.focus();
      await button.press("Enter");
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(filters.locator('[aria-pressed="true"]')).toHaveCount(1);
      await expect(visibleCards).toHaveCount(names.length);
      await expect(visibleCards.locator("h3")).toHaveText([...names]);
      await expect(status).toHaveText(
        label === "All facilities"
          ? "Showing 9 facilities"
          : `Showing ${names.length} ${label} facilities`,
      );
      await expect(cards).toHaveCount(9);
      await expect(page).toHaveURL(/\/#equipment$/);
    }
    const photos = page.locator(".homepage img");
    await expect(photos).toHaveCount(10);
    const sources = await photos.evaluateAll((images) =>
      images.map((image) => image.getAttribute("src")),
    );
    expect(new Set(sources).size).toBe(10);
  });

test("FAQ and equipment navigation work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:4173/");
  await expect(page.locator(".rental-filters")).not.toBeVisible();
  await expect(
    page.locator("#home-rental-grid .equipment-card:visible"),
  ).toHaveCount(9);
  await page.locator(".faq-item summary").first().click();
  await expect(page.locator(".faq-item p").first()).toBeVisible();
  await expect(page.locator(".quick-view:visible")).toHaveCount(0);
  await page.locator(".equipment-card h3 a").first().click();
  await expect(page).toHaveURL(/mobile-kitchen-trailers/);
  await context.close();
});

for (const width of [320, 768, 1024, 1440]) {
  test(`shared templates stay within viewport at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/contact-us/",
      "/equipment-rental/",
      "/equipment-rental/mobile-kitchen-trailers/",
      "/service-areas/",
      "/planning/",
      "/about-us/",
      "/blog/",
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });
}
test("reduced motion removes entry animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const selector of [
    ".rental-hero-copy",
    ".rental-hero-visual",
    ".hero-photo-label",
  ])
    await expect(page.locator(selector)).toHaveCSS("animation-name", "none");
  expect(
    await page
      .locator(".header-contact")
      .evaluate(
        (element) => getComputedStyle(element, "::after").animationName,
      ),
  ).toBe("none");
});
test("location planner carries the selected place into the kitchen inquiry", async ({
  page,
}) => {
  await page.goto("/service-areas/");
  await page
    .getByLabel("Project city and state", { exact: true })
    .fill("Akiak, Alaska");
  await page.getByRole("button", { name: "Explore mobile kitchens" }).click();
  await expect(page.locator("h1")).toHaveText(/Akiak, Alaska/);
  await expect(page.locator("h1")).toHaveText(/(Rental|Lease|Facilities)/);
  await expect(page.locator("[data-project-location]")).toHaveText(
    "Akiak, Alaska",
  );
  await page
    .getByRole("link", { name: "Discuss your kitchen project" })
    .click();
  await expect(
    page.locator('#contact-drawer input[name="location"]'),
  ).toHaveValue("Akiak, Alaska");
});
test("About Us and Blog provide dedicated search-focused content", async ({
  page,
}) => {
  await page.goto("/about-us/");
  await expect(page.locator("h1")).toContainText("Temporary facilities");
  await expect(page.locator(".about-service-grid article")).toHaveCount(4);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /mobile kitchens.*workforce housing/i,
  );
  await page.goto("/blog/");
  await expect(page.locator("h1")).toContainText("Field notes");
  await expect(page.locator(".blog-grid article")).toHaveCount(3);
  await expect(page.locator(".blog-grid")).toContainText(
    "mobile kitchen trailer rental",
  );
});
test("Services keeps recovered service resources organized and reachable", async ({
  page,
}) => {
  await page.goto("/services/");
  const library = page.locator(".service-library");
  await expect(library).toBeVisible();
  await library.locator("summary").click();
  await expect(library.locator(".service-library-links a")).toHaveCount(44);
  await expect(library).toContainText("Base Camps for Rent");
});
test("contact keeps the phone fallback while online intake is disabled", async ({
  page,
}) => {
  await page.goto("/contact-us/");
  await expect(
    page
      .getByRole("link", {
        name: "Call +1 (800) 443 - 5212",
        exact: false,
      })
      .first(),
  ).toHaveAttribute("href", "tel:+18004435212");
  await expect(page.locator("#contact-drawer form")).toHaveCount(1);
  await expect(
    page.locator('#contact-drawer button[type="submit"]'),
  ).toBeDisabled();
  await expect(page.locator("#contact-drawer")).not.toBeVisible();
});
test("initial HTML and unknown-route status work without JavaScript", async ({
  request,
}) => {
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  const html = await home.text();
  expect(html).toContain('id="rental-title"');
  expect(html).toContain("Temporary Facilities Rental");
  expect(html).toContain("Rent or Lease Nationwide");
  expect(html).toContain("Find your rental");
  expect(html).not.toContain("April");
  const missing = await request.get("/missing-synthetic-test-page/");
  expect(missing.status()).toBe(404);
});
