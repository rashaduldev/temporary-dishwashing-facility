import cityGroups from "./regionCities.json" with { type: "json" };

// City groups are geographic orientation points from the 2024 Census Gazetteer.
// Counts vary deterministically by region so the page content stays stable.
const citiesByState = cityGroups as Record<string, string[][]>;

export const regionCities = (state: string, regionIndex: number): string[] =>
  citiesByState[state]?.[regionIndex] || [state, state];
