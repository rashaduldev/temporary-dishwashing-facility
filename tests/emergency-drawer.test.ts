import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Site } from "../src/Site";
import { siteConfig } from "../src/dishwashingConfig";

describe("sticky emergency callback drawer", () => {
  const html = renderToStaticMarkup(createElement(Site, { path: "/" }));

  it("keeps an accessible sticky trigger and direct phone path on every page", () => {
    expect(html).toContain('aria-label="Emergency rental support"');
    expect(html).toContain('aria-controls="emergency-support-panel"');
    expect(html).toContain("24/7 call line");
    expect(html).toContain("Need equipment urgently?");
    expect(html).toContain("Prepare callback details");
    expect(html).toContain("Planning questions?");
    expect(html).toContain("Contact us");
    expect(html).toContain(`href="tel:${siteConfig.phoneE164}"`);
  });

  it("renders the emergency callback brief fields", () => {
    for (const name of [
      "name",
      "phone",
      "email",
      "location",
      "model",
      "incident",
      "startDate",
      "urgency",
      "message",
    ]) {
      expect(html).toContain(`name="${name}"`);
    }
  });

  it("does not claim a callback was sent while delivery is disconnected", () => {
    expect(html).toContain("Notify rental team to call");
    expect(html).toContain("disabled");
    expect(html).toContain("Your entries stay in this browser and have not been sent");
    expect(html).toContain("call 911 or the appropriate local emergency service");
    expect(html).toContain("Final availability, response time and arrival timing require team confirmation");
  });
});
