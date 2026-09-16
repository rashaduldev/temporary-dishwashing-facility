import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RentalCalculator } from "../src/RentalCalculator";
import {
  calculateDeliveryBaseline,
  calculatePlanningEstimate,
  DISHWASHING_MODELS,
} from "../src/calculatorData";

describe("dishwashing rental calculator pricing", () => {
  it.each([
    [20, 995],
    [22, 1_195],
    [24, 1_395],
    [25, 1_495],
    [26, 1_595],
    [30, 1_995],
    [35, 2_495],
    [38, 2_795],
    [40, 2_995],
  ])("calculates the %i-foot delivery baseline", (length, expected) => {
    expect(calculateDeliveryBaseline(length)).toBe(expected);
  });

  it.each([19, 20.5, 41, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects unsupported trailer length %s",
    (length) => {
      expect(calculateDeliveryBaseline(length)).toBeNull();
      expect(calculatePlanningEstimate(length)).toBeNull();
    },
  );

  it("adds the provisional $4,995 equipment input", () => {
    expect(calculatePlanningEstimate(20)).toEqual({
      equipment: 4_995,
      delivery: 995,
      total: 5_990,
      lengthFeet: 20,
    });
    expect(calculatePlanningEstimate(40)?.total).toBe(7_990);
  });

  it("contains only the approved dishwashing model lengths", () => {
    expect(DISHWASHING_MODELS.map(({ lengthFeet }) => lengthFeet)).toEqual([
      22, 24, 26, 38,
    ]);
  });
});

describe("RentalCalculator readable initial HTML", () => {
  const html = renderToStaticMarkup(createElement(RentalCalculator));

  it("renders without browser globals and exposes the default estimate", () => {
    expect(html).toContain("22-foot dishwashing trailer");
    expect(html).toContain("$4,995");
    expect(html).toContain("$1,195");
    expect(html).toContain("$6,190");
  });

  it("includes every planning field and no contact-data gate", () => {
    expect(html).toContain('name="state"');
    expect(html).toContain('name="city"');
    expect(html).toContain('name="postalCode"');
    expect(html).toContain('name="equipment"');
    expect(html).toContain('name="model"');
    expect(html).toContain('name="trailerLength"');
    expect(html).toContain('name="startDate"');
    expect(html).toContain('name="endDate"');
    expect(html).not.toContain('name="email"');
    expect(html).not.toContain('name="phone"');
  });

  it("publishes honest estimate limitations in readable markup", () => {
    expect(html).toContain("nonbinding planning estimate");
    expect(html).toContain("not a final price");
    expect(html).toContain("remain subject to owner approval");
    expect(html).toContain(
      "Rental duration and project-specific charges are excluded",
    );
    expect(html).toContain("Dates do not change this estimate");
    expect(html).toContain("discounts are available");
  });
});
