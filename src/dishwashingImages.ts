export type DishwashingPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type DishwashingPhotoCollection = {
  id: string;
  title: string;
  sourceLabel: string;
  fitNote: string;
  photos: readonly DishwashingPhoto[];
};

const photo = (folder: string, file: string, alt: string, caption: string): DishwashingPhoto => ({
  src: `/images/dishwashing-originals/${folder}/${file}.webp`,
  alt,
  caption,
});

export const lowTempFamily: DishwashingPhotoCollection = {
  id: "22-26ft-low-temp",
  title: "22–26 ft low-temperature dishwashing family",
  sourceLabel: "Original 22–26 ft equipment photography",
  fitNote: "Use for the 22-, 24- and 26-foot planning pages as family-level evidence; confirm the exact delivered layout.",
  photos: [
    photo("22-26ft-low-temp", "commercial-dish-trailer-stainless-workstation", "Wide stainless-steel workstation and sinks inside a 22–26 ft low-temperature dishwashing trailer", "Stainless workstation and wash-line interior"),
    photo("22-26ft-low-temp", "dish-trailer-commercial-dishwasher", "Commercial dishwashing machine with adjacent stainless landing table", "Commercial dishwashing machine and landing table"),
    photo("22-26ft-low-temp", "dish-trailer-handwashing-station", "Handwashing and pre-rinse stations inside a low-temperature dishwashing trailer", "Handwashing and pre-rinse workflow"),
    photo("22-26ft-low-temp", "dish-trailer-rental-exterior", "White tandem-axle temporary dishwashing trailer exterior", "Temporary dishwashing trailer exterior"),
    photo("22-26ft-low-temp", "dish-trailer-three-compartment-sink", "Labeled wash, rinse and sanitize compartments inside a temporary dishwashing trailer", "Three-compartment wash, rinse and sanitize sink"),
    photo("22-26ft-low-temp", "dish-trailer-utility-sink-storage-racks", "Utility sink beside commercial wire storage racks", "Utility sink and clean-storage racks"),
    photo("22-26ft-low-temp", "dishwashing-trailer-wash-rinse-sanitize-sink", "Close view of the stainless wash, rinse and sanitize sink", "Wash, rinse and sanitize compartments"),
    photo("22-26ft-low-temp", "mobile-dish-trailer-interior", "Stainless sinks, dispensers and worktable inside a mobile dishwashing trailer", "Mobile dishwashing trailer sink station"),
  ],
};

export const thirtyFootConveyor: DishwashingPhotoCollection = {
  id: "30ft-conveyor",
  title: "30 ft conveyor dishwashing trailer",
  sourceLabel: "Original 30 ft conveyor exterior photography",
  fitNote: "Exterior reference for the 30-foot conveyor configuration listed in the equipment source sheet.",
  photos: [
    photo("30ft-conveyor", "commercial-conveyor-trailer-rental", "Front three-quarter exterior view of a white 30 ft conveyor dishwashing trailer", "30 ft conveyor trailer—front exterior"),
    photo("30ft-conveyor", "mobile-conveyor-trailer-rental", "Rear three-quarter exterior view of a white mobile conveyor dishwashing trailer", "30 ft conveyor trailer—rear exterior"),
  ],
};

export const thirtyEightLowTemp: DishwashingPhotoCollection = {
  id: "38ft-low-temp",
  title: "38 ft low-temperature push-through trailer",
  sourceLabel: "Original 38 ft low-temperature interior photography",
  fitNote: "Interior reference for the separate 38-foot low-temperature push-through configuration.",
  photos: [
    photo("38ft-low-temp", "commercial-dish-trailer-interior", "Commercial wire storage shelving inside a 38 ft low-temperature dishwashing trailer", "Commercial storage shelving"),
    photo("38ft-low-temp", "dish-trailer-commercial-storage-shelving", "Full aisle view of sinks, worktables and shelving inside a 38 ft dishwashing trailer", "Low-temperature trailer working aisle"),
    photo("38ft-low-temp", "dish-trailer-sink-and-pre-rinse-station", "Stainless sink and pre-rinse station inside a 38 ft low-temperature trailer", "Sink and pre-rinse station"),
    photo("38ft-low-temp", "dish-trailer-stainless-steel-work-table", "Stainless-steel landing and work table inside a 38 ft dishwashing trailer", "Stainless landing and work table"),
  ],
};

export const thirtyEightHighTemp: DishwashingPhotoCollection = {
  id: "38ft-high-temp-conveyor",
  title: "38 ft high-temperature conveyor trailer",
  sourceLabel: "Original 38 ft high-temperature conveyor photography",
  fitNote: "Use for the current 38-foot conveyor planning page; verify the exact delivered equipment and utilities.",
  photos: [
    photo("38ft-high-temp-conveyor", "dish-trailer-rental-complete-interior", "Wide interior view of a 38 ft high-temperature conveyor dishwashing trailer", "Complete 38 ft conveyor interior"),
    photo("38ft-high-temp-conveyor", "dish-trailer-commercial-dishwashing-machine", "High-temperature commercial dishwashing machine inside a conveyor trailer", "Commercial conveyor dishwashing machine"),
    photo("38ft-high-temp-conveyor", "commercial-dish-trailer-dishwasher-loading-station", "Stainless dishwasher loading and pre-rinse station", "Dishwasher loading station"),
    photo("38ft-high-temp-conveyor", "commercial-dish-trailer-three-compartment-sink", "Full wash-line aisle with three-compartment sink and commercial equipment", "Three-compartment sink and wash-line aisle"),
    photo("38ft-high-temp-conveyor", "dish-trailer-commercial-utility-sink", "Commercial utility sink and chemical dispensing station", "Utility sink and dispensing station"),
    photo("38ft-high-temp-conveyor", "dish-trailer-sink-and-stainless-work-tables", "Stainless sink centered between landing tables", "Sink and stainless landing tables"),
    photo("38ft-high-temp-conveyor", "dish-trailer-stainless-work-tables-and-sink", "Hand sink, stainless worktables and clean aisle space", "Hand sink and stainless worktables"),
    photo("38ft-high-temp-conveyor", "dishwashing-trailer-wash-rinse-sanitize-station", "Wash, rinse and sanitize station in a high-temperature conveyor trailer", "Wash, rinse and sanitize station"),
    photo("38ft-high-temp-conveyor", "mobile-dish-trailer-sink-prep-station", "Prep sink and stainless work surface inside a mobile dishwashing trailer", "Sink and preparation station"),
    photo("38ft-high-temp-conveyor", "mobile-dishwashing-trailer-dishwasher-work-area", "Dishwasher work area with sinks and stainless landing tables", "Dishwasher work area"),
  ],
};

export const dishwashingPhotoCollections = [
  lowTempFamily,
  thirtyFootConveyor,
  thirtyEightLowTemp,
  thirtyEightHighTemp,
] as const;

export const modelPhotoCollections: Record<string, DishwashingPhotoCollection> = {
  "dishwashing-22ft": lowTempFamily,
  "dishwashing-24ft": lowTempFamily,
  "dishwashing-26ft": lowTempFamily,
  "dishwashing-38ft-conveyor": thirtyEightHighTemp,
};
