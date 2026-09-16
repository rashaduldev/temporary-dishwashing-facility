export const EQUIPMENT_STARTING_PRICE = 4_995;
export const BASE_DELIVERY_PRICE = 995;
export const BASE_DELIVERY_LENGTH = 20;
export const MAX_DELIVERY_LENGTH = 40;
export const DELIVERY_PRICE_PER_ADDITIONAL_FOOT = 100;

export type DishwashingModel = {
  id: "22-standard" | "24-high-capacity" | "26-workflow" | "38-conveyor";
  name: string;
  lengthFeet: 22 | 24 | 26 | 38;
};

export const DISHWASHING_MODELS: readonly DishwashingModel[] = [
  {
    id: "22-standard",
    name: "22-foot dishwashing trailer",
    lengthFeet: 22,
  },
  {
    id: "24-high-capacity",
    name: "24-foot dishwashing trailer",
    lengthFeet: 24,
  },
  {
    id: "26-workflow",
    name: "26-foot dishwashing trailer",
    lengthFeet: 26,
  },
  {
    id: "38-conveyor",
    name: "38-foot conveyor dishwashing trailer",
    lengthFeet: 38,
  },
] as const;

export type PlanningEstimate = {
  equipment: number;
  delivery: number;
  total: number;
  lengthFeet: number;
};

/**
 * Returns the provisional length-based delivery input supplied for the pilot.
 * This calculation is not location-aware and must not be presented as an
 * approved rate or final quote.
 */
export function calculateDeliveryBaseline(lengthFeet: number): number | null {
  if (
    !Number.isInteger(lengthFeet) ||
    lengthFeet < BASE_DELIVERY_LENGTH ||
    lengthFeet > MAX_DELIVERY_LENGTH
  ) {
    return null;
  }

  return (
    BASE_DELIVERY_PRICE +
    (lengthFeet - BASE_DELIVERY_LENGTH) * DELIVERY_PRICE_PER_ADDITIONAL_FOOT
  );
}

export function calculatePlanningEstimate(
  lengthFeet: number,
): PlanningEstimate | null {
  const delivery = calculateDeliveryBaseline(lengthFeet);
  if (delivery === null) return null;

  return {
    equipment: EQUIPMENT_STARTING_PRICE,
    delivery,
    total: EQUIPMENT_STARTING_PRICE + delivery,
    lengthFeet,
  };
}

export function findDishwashingModel(id: string): DishwashingModel | undefined {
  return DISHWASHING_MODELS.find((model) => model.id === id);
}

export const US_STATES = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["DC", "District of Columbia"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
] as const;
