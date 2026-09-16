import modelData from "../content/dishwashing-models.json" with { type: "json" };
import pilotUrlData from "../content/pilot-url-map.json" with { type: "json" };
import { dishwashingRoutes, type VerificationStatus } from "./dishwashingConfig";

export type DishwashingSpecificationKey =
  | "exteriorDimensions"
  | "dishMachine"
  | "racksPerHour"
  | "waterConnection"
  | "wastewaterConnection"
  | "electricalService"
  | "fuel"
  | "staffingCapacity";

export type DishwashingModel = {
  id: string;
  name: string;
  shortName: string;
  route: string;
  configuration: "standard" | "conveyor";
  nominalLengthFeet: number;
  availability: "unknown";
  verificationStatus: VerificationStatus;
  summary: string;
  specifications: Record<DishwashingSpecificationKey, string | number | null>;
  image: {
    src: string | null;
    alt: string | null;
    status: "no-verified-exact-model-photo";
  };
};

export type PilotUrlEntry = {
  path: string;
  kind:
    | "core"
    | "model"
    | "resource"
    | "pilot-location"
    | "historical-protected"
    | "private";
  action: string;
  h1: string;
  intent: string;
  indexing: string;
  unresolvedFacts: string[];
};

export type ContentSection = {
  eyebrow?: string;
  heading: string;
  body: string;
  bullets?: readonly string[];
  link?: { label: string; href: string };
};

export const dishwashingModels = modelData as unknown as DishwashingModel[];
export const pilotUrlMap = pilotUrlData as unknown as PilotUrlEntry[];

export const homepageContent = {
  eyebrow: "Temporary commercial warewashing",
  h1: "Temporary Commercial Dishwashing Facility Rentals",
  introduction:
    "Plan a temporary dishwashing setup around your menu service, soil-to-clean workflow, site access, and available utilities. Review the four model designations, then confirm the exact equipment and project requirements with the team.",
  primaryCta: {
    label: "Compare dishwashing models",
    href: dishwashingRoutes.equipment,
  },
  secondaryCta: {
    label: "Call about rental availability",
    href: dishwashingRoutes.contact,
  },
  sections: [
    {
      eyebrow: "Start with the workflow",
      heading: "Plan the temporary wash path before selecting a trailer",
      body:
        "Estimate incoming wares, peak meal periods, staging space, staffing, and the movement from scraping and washing through clean storage. A useful plan also accounts for potable water, wastewater, power, access, and the authority responsible for site approval.",
      bullets: [
        "Document peak service and ware types",
        "Separate soiled and clean movement",
        "Confirm connections and site access",
        "Verify the final configuration before scheduling",
      ],
    },
    {
      eyebrow: "Four model designations",
      heading: "Compare by footprint, then verify the details",
      body:
        "The current planning set includes 22-foot, 24-foot, 26-foot, and 38-foot conveyor-designated options. Their exact machines, throughput, utilities, layouts, availability, and dimensions have not yet been verified, so those fields remain unknown.",
      link: {
        label: "View the model guide",
        href: dishwashingRoutes.equipment,
      },
    },
    {
      eyebrow: "Project readiness",
      heading: "Bring the information that shapes a workable setup",
      body:
        "Location, dates, estimated volume, ware types, operating schedule, access constraints, utility information, wastewater plans, and local review requirements give the team a practical starting point. Final suitability and availability require confirmation.",
      link: {
        label: "Prepare your project details",
        href: dishwashingRoutes.contact,
      },
    },
  ] satisfies readonly ContentSection[],
} as const;

export const industryContent = {
  eyebrow: "Operating contexts",
  h1: "Commercial and Institutional Dishwashing Applications",
  introduction:
    "Temporary warewashing may support a planned renovation, equipment interruption, temporary dining operation, or another project with a defined need for dish and utensil processing. The final configuration must be matched to the actual workflow and site.",
  cards: [
    {
      title: "Healthcare and care settings",
      body: "Plan around meal schedules, ware types, restricted access, infection-control procedures, and facility review. No clinical or code-compliance outcome is implied.",
    },
    {
      title: "Schools and campuses",
      body: "Document peak meal windows, return flow, staging space, staffing, and connections before evaluating a temporary configuration.",
    },
    {
      title: "Correctional and secure operations",
      body: "Include controlled access, movement restrictions, supervision, delivery windows, and site-specific approval in early planning.",
    },
    {
      title: "Government and response projects",
      body: "Define procurement requirements, site authority, operating duration, access, utilities, and wastewater responsibilities before discussing equipment.",
    },
    {
      title: "Hospitality and food service",
      body: "Estimate peak covers, serviceware mix, soil handling, clean storage, staff movement, and how the temporary unit connects to the existing operation.",
    },
  ],
} as const;

export const resourceContent = {
  eyebrow: "Planning library",
  h1: "Commercial Warewashing Planning Resources",
  introduction:
    "Use these guides to prepare better project questions. They are general planning material, not engineering, legal, environmental, plumbing, or permitting advice.",
  articles: [
    {
      title: "Backflow prevention for mobile dishwashing trailers",
      href: "/resources/mobile-backflow-protection-systems/",
      summary:
        "A planning overview of potable-water protection, connection review, and the role of the local authority or qualified professional.",
      disclaimer:
        "Required devices and approvals vary by site and jurisdiction; supplied components have not been verified.",
    },
    {
      title: "Dishwashing wastewater containment for emergency operations",
      href: "/resources/hazardous-washdown-liquid-containment/",
      summary:
        "Questions to ask about collection, grease management, holding, pump-out, approved discharge, and responsibility for each step.",
      disclaimer:
        "Tank capacity, included services, and discharge requirements must be confirmed for the project.",
    },
    {
      title: "Warewashing and disposable serviceware planning",
      href: "/resources/warewash-versus-paper-costs/",
      summary:
        "A framework for comparing labor, utilities, waste, storage, procurement, and operational constraints without promising a savings result.",
      disclaimer:
        "Use current project-specific inputs; no cost advantage is asserted.",
    },
  ],
} as const;

// Stable, terse aliases used by the application shell and route components.
export const models = dishwashingModels;
export const industries = industryContent.cards;
export const resources = resourceContent.articles;
export const coreRoutes = pilotUrlMap.filter((entry) =>
  ["core", "model", "resource"].includes(entry.kind),
);

export function getDishwashingModel(idOrRoute: string): DishwashingModel | undefined {
  return dishwashingModels.find(
    (model) => model.id === idOrRoute || model.route === idOrRoute,
  );
}

export function getPilotUrl(path: string): PilotUrlEntry | undefined {
  return pilotUrlMap.find((entry) => entry.path === path);
}

export function knownModelSpecifications(model: DishwashingModel) {
  return Object.entries(model.specifications).filter(([, value]) => value !== null);
}

export function unknownModelSpecifications(model: DishwashingModel) {
  return Object.entries(model.specifications)
    .filter(([, value]) => value === null)
    .map(([key]) => key as DishwashingSpecificationKey);
}
