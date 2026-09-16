import { describe, expect, it } from "vitest";
import {
  canonicalUrl,
  dishwashingSiteConfig,
  robotsPolicy,
} from "../src/dishwashingConfig";
import {
  dishwashingModels,
  homepageContent,
  pilotUrlMap,
  unknownModelSpecifications,
} from "../src/dishwashingContent";

describe("dishwashing content foundation", () => {
  it("keeps the approved identity and canonical origin centralized", () => {
    expect(dishwashingSiteConfig.brand.name).toBe(
      "Temporary Dishwashing Facility For Lease",
    );
    expect(canonicalUrl("calculator?draft=1")).toBe(
      "https://temporary-dishwashing-facility-for-lease.com/calculator/",
    );
  });

  it("keeps staging out of search and public submissions disabled", () => {
    expect(robotsPolicy("staging")).toBe("noindex,follow");
    expect(dishwashingSiteConfig.inquiries.enabled).toBe(false);
    expect(dishwashingSiteConfig.phone.status).toBe("provisional");
  });

  it("models only the four planned configurations and leaves specs unknown", () => {
    expect(dishwashingModels.map((model) => model.nominalLengthFeet)).toEqual([
      22, 24, 26, 38,
    ]);
    for (const model of dishwashingModels) {
      expect(model.verificationStatus).toBe("unverified");
      expect(model.availability).toBe("unknown");
      expect(unknownModelSpecifications(model)).toHaveLength(8);
      expect(model.image.src).toBeNull();
    }
  });

  it("keeps URL records unique and protects the private dashboard", () => {
    const paths = pilotUrlMap.map((entry) => entry.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(pilotUrlMap.find((entry) => entry.path === "/seo/dashboard/")).toMatchObject({
      kind: "private",
      indexing: "noindex",
    });
  });

  it("does not assert unverified operating claims in homepage copy", () => {
    const renderedCopy = JSON.stringify(homepageContent).toLowerCase();
    expect(renderedCopy).not.toContain("24/7");
    expect(renderedCopy).not.toContain("48-hour");
    expect(renderedCopy).not.toContain("500+");
  });
});

