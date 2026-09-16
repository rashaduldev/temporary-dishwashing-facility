export type VerificationStatus =
  | "verified"
  | "provisional"
  | "unverified"
  | "not-connected";

export type EvidenceValue<T> = {
  value: T;
  status: VerificationStatus;
  note: string;
};

export type DishwashingEnvironment = "development" | "staging" | "production";

export const dishwashingRoutes = {
  home: "/",
  equipment: "/dishwashing-trailer-rental/",
  model22: "/22ft-dishwashing-trailer-rental/",
  model24: "/24ft-dishwashing-trailer-rental/",
  model26: "/26ft-dishwashing-trailer-rental/",
  model38Conveyor: "/38ft-conveyor-dishwashing-trailer-rental/",
  calculator: "/calculator/",
  emergency: "/emergency-service/",
  contact: "/commercial-dishwashing-facility-contact/",
  industries: "/industries/",
  serviceAreas: "/service-areas/",
  resources: "/resources/",
  about: "/about-us/",
  privacy: "/privacy/",
  seoAdmin: "/seo/dashboard/",
  seoDiagnostics: "/seo/dashboard/diagnostics/",
  seoGoogleStatus: "/seo/dashboard/google-status/",
  seoAuthority: "/seo/dashboard/authority/",
  seoPortfolio: "/seo/dashboard/portfolio/",
  seoProtectedUrls: "/seo/dashboard/protected-urls/",
  seoNextChecks: "/seo/dashboard/next-checks/",
} as const;

export type DishwashingRouteKey = keyof typeof dishwashingRoutes;

/**
 * Public dishwashing paths used by the Temp123 reference site. These remain
 * redirect-only aliases so the rebuilt site keeps one canonical URL per page.
 */
export const referenceDishwashingUrlMap = [
  { source: "/portable-dishwashing-trailer-rental/", destination: dishwashingRoutes.equipment },
  { source: "/services/dishwashing-trailers/22ft/", destination: dishwashingRoutes.model22 },
  { source: "/services/dishwashing-trailers/24ft/", destination: dishwashingRoutes.model24 },
  { source: "/services/dishwashing-trailers/26ft/", destination: dishwashingRoutes.model26 },
  { source: "/services/dishwashing-trailers/38ft-conveyor/", destination: dishwashingRoutes.model38Conveyor },
] as const;

export const dishwashingSiteConfig = {
  brand: {
    name: "Temporary Dishwashing Facility For Lease",
    shortName: "Temporary Dishwashing Facility",
    siteFamily: "commercial-dishwashing-and-warewashing",
  },
  canonicalOrigin: "https://temporary-dishwashing-facility-for-lease.com",
  defaultLocale: "en-US",
  phone: {
    value: "+18883855513",
    display: "1-888-385-5513",
    status: "provisional",
    note: "Observed on the current site; owner verification is still required before it is treated as authoritative.",
  } satisfies EvidenceValue<string> & { display: string },
  inquiries: {
    enabled: false,
    status: "unverified",
    disabledMessage:
      "Online inquiries are not accepting submissions yet. Call the provisional number shown on this site if you need to discuss a project.",
    note: "Keep forms disabled until the server, consent, abuse protection, persistence, delivery, and end-to-end tests are verified.",
  },
  claims: {
    liveStaffing24Hours: {
      value: null,
      status: "unverified",
      note: "Do not publish a 24/7 staffing claim without owner evidence.",
    },
    deliveryWithin48Hours: {
      value: null,
      status: "unverified",
      note: "Do not promise a delivery time without operational evidence.",
    },
    nationwideAvailability: {
      value: null,
      status: "unverified",
      note: "Describe service-area planning without claiming nationwide availability.",
    },
    citiesServed: {
      value: null,
      status: "unverified",
      note: "Do not publish a city count until it is supported by service records.",
    },
    manufacturerAffiliations: {
      value: null,
      status: "unverified",
      note: "Do not imply a manufacturer relationship or approval.",
    },
  } satisfies Record<string, EvidenceValue<unknown>>,
  robots: {
    development: "noindex,nofollow",
    staging: "noindex,follow",
    production: "index,follow",
  } satisfies Record<DishwashingEnvironment, string>,
} as const;

/**
 * Flat integration contract for the dedicated dishwashing shell.
 * Keep this intentionally boring: pages, metadata, and API UI can all consume
 * the same values without knowing about the evidence model above.
 */
export const siteConfig = {
  brand: dishwashingSiteConfig.brand.name,
  shortBrand: dishwashingSiteConfig.brand.shortName,
  origin: dishwashingSiteConfig.canonicalOrigin,
  phoneDisplay: dishwashingSiteConfig.phone.display,
  phoneE164: "+18883855513",
  phoneVerified: false,
  inquiriesEnabled: dishwashingSiteConfig.inquiries.enabled,
  domainRoutingReady: false,
  stagingNoindex: dishwashingSiteConfig.robots.staging.startsWith("noindex"),
} as const;

function normalizePathname(pathname: string): string {
  const withoutQueryOrHash = pathname.split(/[?#]/, 1)[0] || "/";
  const withLeadingSlash = withoutQueryOrHash.startsWith("/")
    ? withoutQueryOrHash
    : `/${withoutQueryOrHash}`;
  if (withLeadingSlash === "/") return withLeadingSlash;
  return `${withLeadingSlash.replace(/\/+$/, "")}/`;
}

export function canonicalUrl(pathname: string): string {
  return new URL(normalizePathname(pathname), `${dishwashingSiteConfig.canonicalOrigin}/`).toString();
}

export function robotsPolicy(environment: DishwashingEnvironment): string {
  return dishwashingSiteConfig.robots[environment];
}

export function publicContactAction(): {
  kind: "phone-only";
  href: string;
  label: string;
  status: VerificationStatus;
} {
  return {
    kind: "phone-only",
    href: `tel:${dishwashingSiteConfig.phone.value}`,
    label: "Call about rental availability",
    status: dishwashingSiteConfig.phone.status,
  };
}
