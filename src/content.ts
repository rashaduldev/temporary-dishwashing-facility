import site from "../site.json" with { type: "json" };

export const services = [
  {
    slug: "temporary-modular-dishwashing-facility",
    name: "Temporary modular dishwashing facility",
  },
];

export const routes = [
  "/",
  "/dishwashing-trailer-rental/",
  "/22ft-dishwashing-trailer-rental/",
  "/24ft-dishwashing-trailer-rental/",
  "/26ft-dishwashing-trailer-rental/",
  "/38ft-conveyor-dishwashing-trailer-rental/",
  "/calculator/",
  "/emergency-service/",
  "/commercial-dishwashing-facility-contact/",
  "/industries/",
  "/service-areas/",
  "/resources/",
  "/resources/mobile-backflow-protection-systems/",
  "/resources/hazardous-washdown-liquid-containment/",
  "/resources/warewash-versus-paper-costs/",
  "/states/temporary-dishwashing-facility-for-lease-in-colorado-usa/",
  "/states/temporary-dishwashing-facility-for-lease-in-winconsin-usa/",
  "/about-us/",
  "/privacy/",
  "/seo/dashboard/",
  "/seo/dashboard/diagnostics/",
  "/seo/dashboard/google-status/",
  "/seo/dashboard/authority/",
  "/seo/dashboard/portfolio/",
  "/seo/dashboard/protected-urls/",
  "/seo/dashboard/next-checks/",
] as const;

const titles: Record<string, string> = {
  "/": "Temporary Commercial Dishwashing Facility Rentals",
  "/dishwashing-trailer-rental/": "Commercial Dishwashing Trailer Rental",
  "/22ft-dishwashing-trailer-rental/": "22-Foot Commercial Dishwashing Trailer Rental",
  "/24ft-dishwashing-trailer-rental/": "24-Foot Commercial Dishwashing Trailer Rental",
  "/26ft-dishwashing-trailer-rental/": "26-Foot Commercial Dishwashing Trailer Rental",
  "/38ft-conveyor-dishwashing-trailer-rental/": "38-Foot Conveyor Dishwashing Trailer Rental",
  "/calculator/": "Nationwide Temporary Dishwashing Facility Rental and Delivery Calculator",
  "/emergency-service/": "Emergency Commercial Dishwashing Facility Rental",
  "/commercial-dishwashing-facility-contact/": "Request Commercial Dishwashing Rental Availability",
  "/industries/": "Industries Served by Temporary Dishwashing Facilities",
  "/service-areas/": "Commercial Dishwashing Facility Rental Service Areas",
  "/resources/": "Commercial Warewashing Planning Resources",
  "/resources/mobile-backflow-protection-systems/": "Backflow Prevention for Mobile Dishwashing Trailers",
  "/resources/hazardous-washdown-liquid-containment/": "Dishwashing Wastewater Containment for Emergency Operations",
  "/resources/warewash-versus-paper-costs/": "Warewashing Trailers and Disposable Serviceware Cost Planning",
  "/states/temporary-dishwashing-facility-for-lease-in-colorado-usa/": "Colorado Commercial Dishwashing Facility Rental",
  "/states/temporary-dishwashing-facility-for-lease-in-winconsin-usa/": "Wisconsin Commercial Dishwashing Facility Rental",
  "/about-us/": "About Temporary Dishwashing Facility For Lease",
  "/privacy/": "Privacy Policy",
  "/seo/dashboard/": "SEO and Site Health Dashboard",
  "/seo/dashboard/diagnostics/": "SEO Serving and Data Diagnostics",
  "/seo/dashboard/google-status/": "Google Indexing Status Dashboard",
  "/seo/dashboard/authority/": "SEO Authority Integrations",
  "/seo/dashboard/portfolio/": "Portfolio Migration Readiness",
  "/seo/dashboard/protected-urls/": "Protected URL Registry",
  "/seo/dashboard/next-checks/": "SEO Integration Checklist",
};

const descriptions: Record<string, string> = {
  "/": "Plan a temporary commercial dishwashing facility for renovations, equipment outages, institutional food service and time-critical projects. Compare configurations and request availability.",
  "/dishwashing-trailer-rental/": "Compare temporary commercial dishwashing trailer sizes, workflow considerations, utility planning and rental next steps.",
  "/calculator/": "Create a nonbinding starting estimate for temporary dishwashing equipment and length-based delivery planning. Final price and availability require confirmation.",
  "/emergency-service/": "Prepare the details needed for a time-critical temporary dishwashing rental and contact the rental team by phone.",
  "/commercial-dishwashing-facility-contact/": "Share your equipment, location, timing, utility and project requirements to request rental availability.",
  "/industries/": "Temporary commercial dishwashing planning for healthcare, education, correctional, government, military, hospitality and large food-service operations.",
  "/service-areas/": "Discuss temporary dishwashing facility delivery for commercial and institutional projects across the United States. Availability varies by location and schedule.",
  "/resources/": "Read practical planning guidance for temporary warewashing utilities, wastewater, workflows and project costs.",
  "/about-us/": "Learn how Temporary Dishwashing Facility For Lease helps commercial and institutional teams plan temporary warewashing operations.",
  "/privacy/": "Read how this website handles inquiry information and privacy choices.",
  "/seo/dashboard/": "Owner-only evidence dashboard for URL health, indexing signals, protected URLs and migration readiness.",
  "/seo/dashboard/diagnostics/": "Owner-only serving, application-data and performance diagnostics with evidence provenance.",
  "/seo/dashboard/google-status/": "Owner-only verified Google Search Console indexing evidence and status definitions.",
  "/seo/dashboard/authority/": "Owner-only third-party authority integration status and evidence requirements.",
  "/seo/dashboard/portfolio/": "Owner-only portfolio migration readiness and unresolved-work status.",
  "/seo/dashboard/protected-urls/": "Owner-only protected historical URL registry and restoration evidence.",
  "/seo/dashboard/next-checks/": "Owner-only controlled checklist for connecting crawl and search evidence.",
};

export function pageInfo(path: string) {
  const title = titles[path] || "Page not found";
  return {
    title: `${title} | ${site.brand}`,
    description:
      descriptions[path] ||
      `Plan temporary commercial dishwashing equipment, site utilities and delivery. Call ${site.phoneDisplay} to discuss availability.`,
  };
}
