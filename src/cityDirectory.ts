import inventory from "./cityDirectory.json" with { type: "json" };
import { cityEditorial } from "./cityEditorial";
import { stateGuides } from "./stateGuides";
import { statePath } from "./statePaths";

type CensusRow = [
  geoid: string,
  name: string,
  state: string,
  regionIndex: number,
  slug: string,
  latitude: number,
  longitude: number,
  landSqMi: number,
  kind: "incorporated" | "community",
  censusName: string,
];

export type CityPage = {
  geoid: string;
  name: string;
  state: string;
  region: string;
  regionIndex: number;
  path: string;
  regionPath: string;
  statePath: string;
  latitude: number;
  longitude: number;
  landSqMi: number;
  kind: "incorporated" | "community";
  censusName: string;
};

const slug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const cityPages: CityPage[] = (inventory.records as CensusRow[]).map(
  ([
    geoid,
    name,
    state,
    regionIndex,
    citySlug,
    latitude,
    longitude,
    landSqMi,
    kind,
    censusName,
  ]) => {
    const region = stateGuides[state].regions[regionIndex];
    const regionPath = `/service-areas/${slug(state)}/${slug(region)}/`;
    return {
      geoid,
      name,
      state,
      region,
      regionIndex,
      path: `${regionPath}${citySlug}/`,
      regionPath,
      statePath: statePath(state),
      latitude,
      longitude,
      landSqMi,
      kind,
      censusName,
    };
  },
);

export const reviewedCityPages = cityPages.filter((city) =>
  Boolean(cityEditorial[city.geoid]),
);

export const cityPageByPath = Object.fromEntries(
  reviewedCityPages.map((city) => [city.path, city]),
) as Record<string, CityPage | undefined>;

export const hasCityGuide = (city: CityPage): boolean =>
  Boolean(cityEditorial[city.geoid]);

const byRegion = new Map<string, CityPage[]>();
for (const city of cityPages) {
  const current = byRegion.get(city.regionPath) || [];
  current.push(city);
  byRegion.set(city.regionPath, current);
}

export const citiesForRegion = (path: string): CityPage[] =>
  byRegion.get(path) || [];

export const nearbyCities = (city: CityPage, limit = 4): CityPage[] =>
  citiesForRegion(city.regionPath)
    .filter((other) => other.geoid !== city.geoid && hasCityGuide(other))
    .map((other) => ({
      other,
      distance:
        (other.latitude - city.latitude) ** 2 +
        ((other.longitude - city.longitude) *
          Math.cos((city.latitude * Math.PI) / 180)) **
          2,
    }))
    .sort(
      (a, b) =>
        a.distance - b.distance || a.other.name.localeCompare(b.other.name),
    )
    .slice(0, limit)
    .map(({ other }) => other);
