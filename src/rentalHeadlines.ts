const locationSeed = (value: string) =>
  [...value].reduce(
    (seed, character) => (seed * 31 + character.charCodeAt(0)) >>> 0,
    7,
  );

const select = <T>(items: readonly T[], key: string) =>
  items[locationSeed(key) % items.length];

const stateHeadlines = [
  (state: string) => `${state} Mobile Kitchen Trailer Rental`,
  (state: string) => `${state} Temporary Facilities Lease`,
  (state: string) => `${state} Emergency Shower Trailer Rental`,
  (state: string) => `${state} Sleeper Bunkbed Trailer Rental`,
  (state: string) => `${state} Portable Facilities Rental`,
  (state: string) => `${state} Mobile Trailer Lease`,
  (state: string) => `${state} Emergency Trailer Rental`,
  (state: string) => `${state} Shower and Restroom Trailer Rental`,
] as const;

export const regionLocationLabel = (region: string, state: string) =>
  region.toLowerCase().includes(state.toLowerCase())
    ? region
    : `${region}, ${state}`;

const regionHeadlines = [
  (location: string) => `${location} Mobile Kitchen Trailer Rental`,
  (location: string) => `${location} Temporary Facilities Lease`,
  (location: string) => `${location} Emergency Shower Trailer Rental`,
  (location: string) => `${location} Sleeper Bunkbed Trailer Rental`,
  (location: string) => `${location} Portable Facilities Rental`,
  (location: string) => `${location} Mobile Trailer Lease`,
  (location: string) => `${location} Emergency Trailer Rental`,
  (location: string) => `${location} Shower and Restroom Trailer Rental`,
] as const;

export const stateRentalHeadline = (state: string) =>
  select(stateHeadlines, state)(state);

export const regionRentalHeadline = (
  region: string,
  state: string,
  regionIndex: number,
) =>
  regionHeadlines[(locationSeed(state) + regionIndex) % regionHeadlines.length](
    regionLocationLabel(region, state),
  );

const cityServiceHeadlines = {
  kitchen: [
    (location: string) => `${location} Mobile Kitchen Rental`,
    (location: string) => `${location} Kitchen Trailer Lease`,
  ],
  shower: [
    (location: string) => `${location} Emergency Shower Trailer Rental`,
    (location: string) => `${location} Portable Shower Trailer Lease`,
  ],
  combination: [
    (location: string) => `${location} Shower and Restroom Trailer Rental`,
    (location: string) => `${location} Combination Trailer Lease`,
  ],
  restroom: [
    (location: string) => `${location} Restroom Trailer Rental`,
    (location: string) => `${location} Portable Restroom Trailer Lease`,
  ],
  sleeper: [
    (location: string) => `${location} Sleeper Bunkbed Trailer Rental`,
    (location: string) => `${location} Base Camp Trailer Lease`,
  ],
  facility: [
    (location: string) => `${location} Temporary Facilities Rental`,
    (location: string) => `${location} Portable Facility Lease`,
  ],
} as const;

export const cityRentalHeadline = (location: string, service: string) => {
  const lowerService = service.toLowerCase();
  const kind = /kitchen/.test(lowerService)
    ? "kitchen"
    : /combination|shower.*restroom|restroom.*shower/.test(lowerService)
      ? "combination"
      : /restroom/.test(lowerService)
        ? "restroom"
        : /shower/.test(lowerService)
          ? "shower"
          : /sleep|bunk/.test(lowerService)
            ? "sleeper"
            : "facility";
  return select(cityServiceHeadlines[kind], `${location}-${service}`)(location);
};

export const rentalProductHeadline = (name: string) =>
  /rental|lease/i.test(name) ? name : `${name} Rental`;

const categoryHeadlines: Record<string, string> = {
  "Mobile Kitchens": "Mobile Kitchen Trailer Rental",
  Dishwashing: "Dishwashing Trailer Rental",
  Refrigeration: "Refrigerated Trailer Rental",
  Shower: "Emergency Shower Trailer Rental",
  Restroom: "Restroom Trailer Rental",
  "Shower and Restroom Combination Trailers":
    "Shower and Restroom Trailer Rental",
  Sleeper: "Sleeper Bunk Bed Trailer Rental",
  Laundry: "Laundry Trailer Rental",
  "Handwashing Trailers": "Portable Handwashing Trailer Rental",
};

export const rentalCategoryHeadline = (name: string) =>
  categoryHeadlines[name] || `${name} Facility Rental`;
