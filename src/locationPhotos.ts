import manifest from "./locationPhotos.json" with { type: "json" };

export type LocationPhoto = {
  image: string;
  imageAlt: string;
  caption: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  width: number;
  height: number;
};

const photos = manifest as {
  states: Record<string, LocationPhoto>;
  regions: Record<string, LocationPhoto>;
};

export const stateLocationPhoto = (state: string): LocationPhoto | undefined =>
  photos.states[state];
export const regionLocationPhoto = (path: string): LocationPhoto | undefined =>
  photos.regions[path];
