import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`homepage state modal is centered at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.locator("[data-state-picker]").selectOption("Texas");

    const dialog = page.locator("#state-services-dialog");
    await expect(dialog).toBeVisible();

    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width / 2).toBeCloseTo(viewport.width / 2, 0);
    expect(box!.y + box!.height / 2).toBeCloseTo(viewport.height / 2, 0);
  });
}
