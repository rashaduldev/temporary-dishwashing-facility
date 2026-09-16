import { test, expect } from "@playwright/test";
import consolidation from "../../content/location-consolidation.json" with { type: "json" };

test("every consolidated city URL resolves in one hop with its original location", async ({
  request,
}) => {
  for (const row of consolidation.routes) {
    const first = await request.get(row.path, { maxRedirects: 0 });
    expect(first.status(), row.path).toBe(308);
    const destination = new URL(
      first.headers().location,
      "http://localhost:4173",
    );
    expect(destination.pathname, row.path).toBe(consolidation.destination);
    expect(destination.searchParams.get("location"), row.path).toBe(
      row.location,
    );
    const target = await request.get(
      destination.pathname + destination.search,
      { maxRedirects: 0 },
    );
    expect(target.status(), row.path).toBe(200);
  }
});

test("old city link retains location and the approved service names", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "/equipment-rental/mobile-kitchen-trailers/akiak-mobile-kitchen-rental/",
  );
  await expect(page.locator("h1")).toHaveText(/Akiak/);
  await expect(page.locator("h1")).toHaveText(/(Rental|Lease|Facilities)/);
  await expect(page.locator("[data-project-location]")).toHaveText("Akiak");
  await expect(
    page
      .getByRole("link", { name: /24ft Mobile Kitchen Trailer/ })
      .filter({ visible: true }),
  ).toBeVisible();
  await page.locator('.service-category-cards a[href*="/24ft/"]').click();
  await expect(page.locator("h1")).toHaveText(/Akiak/);
  await page
    .getByRole("link", { name: "Contact Us at Temporary123", exact: true })
    .click();
  await expect(
    page.locator('#contact-drawer input[name="location"]'),
  ).toHaveValue("Akiak");
});

test("location planner supports keyboard submission without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:4173/service-areas/");
  await page
    .getByLabel("Project city and state", { exact: true })
    .fill("Arlington, Texas");
  await page
    .getByLabel("Project city and state", { exact: true })
    .press("Escape");
  await page
    .getByRole("button", { name: "Explore mobile kitchens" })
    .press("Enter");
  expect(new URL(page.url()).searchParams.get("location")).toBe(
    "Arlington, Texas",
  );
  await expect(page.locator("h1")).toHaveText("Mobile Kitchen Trailer Rental");
  await expect(page.locator(".service-category-cards a")).toHaveCount(7);
  await context.close();
});
