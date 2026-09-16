import { equipmentSet } from "./equipmentPhotos";
import { statePath } from "./statePaths";
import site from "../site.json" with { type: "json" };
import { stateGuides } from "./stateGuides";
import { regionCities } from "./regionCities";
import { citiesForRegion, hasCityGuide } from "./cityDirectory";
import {
  buildRegionSeasonalDemand,
  type SeasonalDemand,
} from "./seasonalDemand";
import { regionRentalHeadline } from "./rentalHeadlines";
import { capitalizeLinkLabel } from "./linkLabels";

export const regionSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const regionPath = (state: string, region: string) =>
  `/service-areas/${regionSlug(state)}/${regionSlug(region)}/`;

type ContextualLink = {
  href: string;
  label: string;
  context: string;
};

const priorityServices = [
  {
    href: "/equipment-rental/mobile-kitchen-trailers/",
    labels: [
      "mobile commercial kitchen rentals",
      "temporary kitchen facilities for rent",
      "mobile kitchen trailer leasing",
    ],
  },
  {
    href: "/services/shower-restroom-combination-trailers/",
    labels: [
      "shower and restroom combination trailer rentals",
      "temporary shower and restroom facilities",
      "combination hygiene trailers for lease",
    ],
  },
  {
    href: "/services/shower-trailers/22ft-10-stall/",
    labels: [
      "22 ft 10-stall shower trailer rentals",
      "10-stall shower trailers for rent",
      "temporary 22 ft shower facilities",
    ],
  },
  {
    href: "/equipment-rental/mobile-sleep-trailers/",
    labels: [
      "sleeper and bunkbed trailer rentals",
      "temporary crew accommodation for lease",
      "mobile sleeper trailers for rent",
    ],
  },
] as const;

const cityContexts = [
  "support construction and renovation crews.",
  "fit planned facility interruptions.",
  "support emergency base camp planning.",
  "serve remote and phased projects.",
  "follow local access and utility needs.",
  "support seasonal site operations.",
  "serve industrial and public projects.",
  "adapt to changing crew schedules.",
] as const;

const commercialIntentTemplates = [
  "Compare temporary facilities for rent, short-term rentals and longer equipment leasing plans.",
  "Temporary facility rental options include equipment for rent and longer lease arrangements.",
  "Project teams can request temporary facilities for rent, flexible rentals or longer leasing terms.",
  "Compare rentals for short assignments with temporary facility leasing and equipment for rent.",
  "A temporary facilities rental can combine equipment for rent with longer lease options.",
  "Rental planning covers temporary facilities for rent, available rentals and equipment leasing.",
] as const;

const buildCityLinks = (
  state: string,
  cities: string[],
  globalIndex: number,
  path: string,
): ContextualLink[] =>
  cities.map((city, cityIndex) => {
    const service = priorityServices[(globalIndex + cityIndex) % 4];
    const label =
      service.labels[(globalIndex + cityIndex * 2) % service.labels.length];
    const cityGuide = citiesForRegion(path).find(
      (entry) => entry.name.toLowerCase() === city.toLowerCase(),
    );
    return {
      href: cityGuide && hasCityGuide(cityGuide)
        ? cityGuide.path
        : `${service.href}?location=${encodeURIComponent(`${city}, ${state}`)}`,
      label: capitalizeLinkLabel(`${label} in ${city}`),
      context:
        cityContexts[(globalIndex * 3 + cityIndex) % cityContexts.length],
    };
  });

const buildServiceLinks = (globalIndex: number): ContextualLink[] =>
  priorityServices.map((service, serviceIndex) => ({
    href: service.href,
    label: capitalizeLinkLabel(
      service.labels[(globalIndex + serviceIndex) % service.labels.length],
    ),
    context: [
      "for temporary meal production.",
      "for coordinated daily hygiene.",
      "for dedicated shower capacity.",
      "for base camps and man camps.",
    ][serviceIndex],
  }));

const introTemplates = [
  (state: string, region: string) =>
    `Teams planning work in ${region}, ${state} can arrange temporary facilities around the site's access, occupancy and schedule. Rent mobile kitchens, shower and restroom combination trailers, and sleeper or bunkbed trailers when the project needs a reliable base camp.`,
  (state: string, region: string) =>
    `A ${region} project in ${state} may need a temporary facility plan that connects food service, hygiene and crew support. Compare short-term rental options with a longer lease, then confirm delivery access and utility requirements for the exact site.`,
  (state: string, region: string) =>
    `For work across ${region}, ${state}, Temporary123 helps project teams plan rental facilities before mobilization. The conversation can cover mobile commercial kitchens, 22 ft 10-stall shower trailers, combination units and sleeper or bunkbed rentals for short or extended assignments.`,
  (state: string, region: string) =>
    `Project managers in ${region}, ${state} can use a temporary facilities rental plan to keep crews supported during construction, renovation or remote work. Review the site route, equipment footprint and servicing plan before choosing a rent or lease arrangement.`,
  (state: string, region: string) =>
    `When a site is located in ${region}, ${state}, a coordinated temporary facility rental keeps the next phase moving. Discuss kitchen capacity, shower and restroom combinations, sleeper or bunkbed trailers and the delivery sequence with our team.`,
  (state: string, region: string) =>
    `A clear rental brief for ${region}, ${state} should name the work area, crew size and operating dates. Temporary123 can help compare mobile kitchen, hygiene and sleeper trailer options for a short-term rent or a longer lease.`,
] as const;

const formatCityList = (cities: string[]) => {
  if (cities.length < 2) return cities[0] || "the surrounding area";
  if (cities.length === 2) return `${cities[0]} and ${cities[1]}`;
  return `${cities.slice(0, -1).join(", ")}, and ${cities.at(-1)}`;
};

const detailTemplates = [
  (state: string, region: string) =>
    `In ${region}, the local access plan is the starting point. Share the nearest approach, turning space and service connections so a temporary facility rental can be positioned safely in ${state}.`,
  (state: string, region: string) =>
    `For ${region} sites, match the facility mix to the people who use it each day. A rent or lease plan can combine food preparation, showers, restrooms and crew sleeping space without separating the servicing route.`,
  (state: string, region: string) =>
    `The ${region} work pattern may change between setup and peak operations. Confirm the dates, occupancy and utility plan before reserving a temporary facilities rental in ${state}.`,
  (state: string, region: string) =>
    `A practical ${region} brief should show where deliveries arrive and where the temporary units will sit. That detail helps our team review a short-term rent or longer lease for the ${state} project.`,
  (state: string, region: string) =>
    `For a ${region} deployment, keep the kitchen, hygiene and sleeping routes easy to service. We can discuss a temporary facility rental that fits the working footprint and the project timeline in ${state}.`,
  (state: string, region: string) =>
    `Before equipment moves to ${region}, confirm the receiving contact, ground conditions and return route. These details support a transparent rent or lease conversation for temporary facilities in ${state}.`,
] as const;

const factTemplates = [
  (state: string, region: string, fact: string) =>
    `${fact} This regional guide helps teams connect that state context with a ${region} rental plan.`,
  (state: string, region: string, fact: string) =>
    `${fact} Use the ${region} location name when requesting a temporary facility rent or lease in ${state}.`,
  (state: string, region: string, fact: string) =>
    `${fact} The regional context is useful when arranging delivery for a ${region} temporary facilities rental.`,
  (state: string, region: string, fact: string) =>
    `${fact} Include ${region} in the project brief so the right rental and servicing discussion can begin.`,
] as const;

const regionStateEntries = Object.entries(stateGuides);

const buildRegionVisuals = (
  index: number,
  state: string,
  region: string,
  cities: string[],
) => equipmentSet(index);

export type RegionGuide = {
  state: string;
  region: string;
  path: string;
  index: number;
  layout: number;
  image: string;
  imageAlt: string;
  gallery: { image: string; imageAlt: string; caption: string }[];
  intro: string;
  detail: string;
  fact: string;
  cities: string[];
  cityLinks: ContextualLink[];
  serviceLinks: ContextualLink[];
  commercialSummary: string;
  seasonal: SeasonalDemand;
};

export const regionPages: RegionGuide[] = regionStateEntries.flatMap(
  ([state, guide], stateIndex) => {
    const stateOffset = regionStateEntries
      .slice(0, stateIndex)
      .reduce((total, [, item]) => total + item.regions.length, 0);
    return guide.regions.map((region, regionIndex) => {
      const index = regionIndex;
      const path = regionPath(state, region);
      const cities = regionCities(state, regionIndex);
      const visuals = buildRegionVisuals(
        stateOffset + regionIndex,
        state,
        region,
        cities,
      );
      const globalIndex = stateOffset + regionIndex;
      return {
        state,
        region,
        path,
        index,
        layout: (Object.keys(stateGuides).indexOf(state) + index) % 6,
        image: visuals[0].image,
        imageAlt: visuals[0].imageAlt,
        gallery: visuals.slice(1, 3),
        intro: `Rent or lease Temporary Facilities in ${region}, ${state}. ${introTemplates[index % introTemplates.length](state, region)}`,
        detail: detailTemplates[index % detailTemplates.length](state, region),
        fact: factTemplates[index % factTemplates.length](
          state,
          region,
          guide.fact,
        ),
        cities,
        cityLinks: buildCityLinks(state, cities, globalIndex, path),
        serviceLinks: buildServiceLinks(globalIndex),
        commercialSummary:
          commercialIntentTemplates[
            globalIndex % commercialIntentTemplates.length
          ],
        seasonal: buildRegionSeasonalDemand(state, region, regionIndex, cities),
      };
    });
  },
);

export const regionPageByPath = Object.fromEntries(
  regionPages.map((page) => [page.path, page]),
) as Record<string, RegionGuide | undefined>;

const crossBorderRegionPaths: Record<string, string> = {
  "/service-areas/arizona/northern-arizona/":
    "/service-areas/utah/southwestern-utah/",
  "/service-areas/arizona/phoenix-area/":
    "/service-areas/nevada/las-vegas-valley/",
  "/service-areas/arizona/southern-arizona/":
    "/service-areas/new-mexico/southwest-new-mexico/",
  "/service-areas/delaware/northern-delaware/":
    "/service-areas/pennsylvania/philadelphia-and-southeast/",
  "/service-areas/delaware/central-delaware/":
    "/service-areas/maryland/eastern-shore/",
  "/service-areas/delaware/delaware-beaches/":
    "/service-areas/maryland/eastern-shore/",
  "/service-areas/indiana/northern-indiana/":
    "/service-areas/illinois/chicago-area/",
  "/service-areas/indiana/central-indiana/":
    "/service-areas/ohio/southwest-ohio/",
  "/service-areas/indiana/southern-indiana/":
    "/service-areas/kentucky/south-central-kentucky/",
};

export const relatedRegionPages = (guide: RegionGuide): RegionGuide[] => {
  const allStatePages = regionPages.filter(
    (page) => page.state === guide.state,
  );
  const position = allStatePages.findIndex((page) => page.path === guide.path);
  const orderedStatePages = [1, -1, 2]
    .map(
      (offset) =>
        allStatePages[
          (position + offset + allStatePages.length) % allStatePages.length
        ],
    )
    .filter((page): page is RegionGuide => page.path !== guide.path);
  const unique = [
    ...new Map(orderedStatePages.map((page) => [page.path, page])).values(),
  ];
  const crossBorder = regionPageByPath[crossBorderRegionPaths[guide.path]];
  if (unique.length < 3 && crossBorder) unique.push(crossBorder);
  for (const page of allStatePages) {
    if (unique.length >= 3) break;
    if (
      page.path !== guide.path &&
      !unique.some((candidate) => candidate.path === page.path)
    )
      unique.push(page);
  }
  return unique.slice(0, 3);
};

export function RegionDetail({ guide }: { guide: RegionGuide }) {
  const nearby = relatedRegionPages(guide);
  const query = encodeURIComponent(
    `${guide.cities[0]}, ${guide.state}, United States`,
  );
  return (
    <article className={`region-page region-layout-${guide.layout}`}>
      <section className="region-hero">
        <div className="wrap section region-hero-grid">
          <div className="region-hero-copy">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/service-areas/">Service Areas</a>
              <span>/</span>
              <a href={statePath(guide.state)}>{guide.state}</a>
              <span>/</span>
              <span aria-current="page">{guide.region}</span>
            </nav>
            <p className="eyebrow">REGIONAL RENTAL GUIDE</p>
            <h1>
              {regionRentalHeadline(guide.region, guide.state, guide.index)}
            </h1>
            <p className="region-intro">{guide.intro}</p>
            <p className="region-emergency">Emergency 24/7</p>
            <a className="button" href={`tel:${site.phoneE164}`}>
              Call now {site.phoneDisplay}
            </a>
          </div>
          <figure className="region-hero-visual">
            <img
              src={guide.image}
              alt={guide.imageAlt}
              width="850"
              height="650"
              fetchPriority="high"
            />
            <figcaption>
              <span>{guide.region}</span>
              <strong>Equipment for your base camp</strong>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="region-answer" aria-labelledby="region-faq-title">
        <div className="wrap section region-answer-card">
          <div className="region-answer-heading">
            <span className="eyebrow">QUICK ANSWER</span>
            <h2 id="region-faq-title">What can you rent in {guide.region}?</h2>
            <p>
              Rent or lease Temporary Facilities for construction, man camps,
              renovations and emergency base camps. Confirm availability,
              occupancy and utilities with our rental team.
            </p>
          </div>
          <div className="region-answer-body">
            <ul className="region-service-links">
              {guide.serviceLinks.map((service) => (
                <li key={service.href}>
                  <a href={service.href}>{service.label}</a>
                </li>
              ))}
            </ul>
            <p className="supporting-rentals">
              Supporting rentals: dishwashing, refrigeration, restrooms, laundry
              and handwashing trailers.
            </p>
          </div>
        </div>
      </section>
      <section
        className="wrap section region-city-links"
        aria-labelledby="region-cities-title"
      >
        <div className="region-section-heading">
          <div>
            <span className="eyebrow">CITIES WE SERVE</span>
            <h2 id="region-cities-title">Rental locations in {guide.region}</h2>
          </div>
          <p className="region-parent-state">
            Explore all rental regions in{" "}
            <a href={statePath(guide.state)}>{guide.state}</a>.
          </p>
        </div>
        <div className="region-city-link-grid">
          {guide.cityLinks.map((city) => (
            <p key={city.href}>
              <a href={city.href}>{city.label}</a>
            </p>
          ))}
        </div>
        <a className="region-city-directory-link" href={`${guide.path}cities/`}>
          Browse all {citiesForRegion(guide.path).length} {guide.region} rental locations ↗
        </a>
      </section>
      <section
        className="wrap section region-seasonal"
        aria-labelledby="region-seasonal-title"
      >
        <div className="region-seasonal-heading">
          <span className="eyebrow">LOCAL AND SEASONAL INFORMATION</span>
          <h2 id="region-seasonal-title">Rental Planning Conditions</h2>
        </div>
        <div className="region-seasonal-copy">
          <p>{stateGuides[guide.state].seasonal.summary[0]}</p>
          <p>{guide.seasonal.summary[1]}</p>
          <p>
            Plan Temporary Facilities for construction seasons, camps, cleanup,
            kitchen fires, Health Department closures, equipment failures and
            renovations. Rental kitchens, hygiene units and crew accommodation
            support the site while permanent facilities are unavailable.
          </p>
        </div>
        <aside className="region-demand-card">
          <span>Estimated seasonal facility demand</span>
          <strong>
            Code {guide.seasonal.code} · {guide.seasonal.label}
          </strong>
          <p>
            Applies to the {guide.region} regional district, based on normal
            seasonal work and regional weather risks. This is a planning
            estimate, not an official government risk rating.
          </p>
        </aside>
        <nav
          className="region-seasonal-sources"
          aria-label="Planning information sources"
        >
          <span>Planning references:</span>
          {guide.seasonal.sources.map((source) => (
            <a
              href={source.href}
              key={source.href}
              target="_blank"
              rel="external noreferrer"
            >
              {source.label}
            </a>
          ))}
        </nav>
      </section>
      <section className="wrap section region-gallery-section">
        <div className="region-section-heading">
          <div>
            <span className="eyebrow">EQUIPMENT REFERENCES</span>
            <h2>Equipment for your rental plan</h2>
          </div>
        </div>
        <div className="region-gallery">
          {guide.gallery.map((item) => (
            <figure key={item.image}>
              <div className="region-gallery-image">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  width="850"
                  height="650"
                  loading="lazy"
                />
              </div>
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <nav
        className="wrap section region-nearby"
        aria-label="Related travel regions"
      >
        <h2>Explore nearby rental regions</h2>
        <div className="region-nearby-links">
          {nearby.map((page) => (
            <p key={page.path}>
              <a href={page.path}>
                {page.region}, {page.state}
              </a>
            </p>
          ))}
        </div>
      </nav>
      <section className="region-map-strip" aria-labelledby="region-map-title">
        <div className="wrap region-map-grid">
          <div className="region-map-copy">
            <span className="eyebrow">REGIONAL COVERAGE</span>
            <h2 id="region-map-title">{guide.region} travel area</h2>
            <p>Review the route to your site with the rental team.</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${query}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
          <figure className="region-map-visual">
            <iframe
              src={`https://www.google.com/maps/?q=${query}&output=embed&z=7`}
              title={`Google Map near ${guide.cities[0]}, ${guide.state}`}
              width="960"
              height="280"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </figure>
        </div>
      </section>
    </article>
  );
}
