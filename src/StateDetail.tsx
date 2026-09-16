import site from "../site.json" with { type: "json" };
import { stateGuides } from "./stateGuides";
import { statePath } from "./statePaths";
import { regionPages } from "./regionGuides";
import { serviceCategories } from "./serviceMenu";
import { stateRentalHeadline } from "./rentalHeadlines";
import { capitalizeLinkLabel } from "./linkLabels";
import { citiesForRegion } from "./cityDirectory";

export const statePageByPath = Object.fromEntries(
  Object.keys(stateGuides).map((name) => [statePath(name), name]),
);
export function StateDetail({ name }: { name: string }) {
  const guide = stateGuides[name];
  const headline =
    name === "Texas"
      ? "Emergency trailer rental, shower, kitchen, shower and bathroom combination, sleeper bunk bed, and complete man-camp services."
      : stateRentalHeadline(name);
  const regions = regionPages.filter((region) => region.state === name);
  const priority = [
    "Mobile Kitchens",
    "Shower and Restroom Combination Trailers",
    "Shower",
    "Sleeper",
  ];
  const services = [...serviceCategories].sort(
    (a, b) =>
      (priority.includes(a.name) ? priority.indexOf(a.name) : 9) -
      (priority.includes(b.name) ? priority.indexOf(b.name) : 9),
  );
  const labels: Record<string, string> = {
    "Mobile Kitchens": "Mobile commercial kitchen rentals",
    Shower: "Shower trailer rentals, 22 ft with 10 stalls",
    Sleeper: "Sleeper and bunkbed trailer rentals",
  };
  return (
    <article className={`state-page region-page region-layout-${guide.layout}`}>
      <section className="region-hero">
        <div className="wrap section region-hero-grid">
          <div className="region-hero-copy">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/service-areas/">Service Areas</a>
              <span>/</span>
              <span aria-current="page">{name}</span>
            </nav>
            <p className="eyebrow">STATE RENTAL GUIDE</p>
            <h1>{headline}</h1>
            <p className="region-intro">{guide.intro}</p>
            <p className="region-emergency">Emergency 24/7</p>
            <a className="button" href={`tel:${site.phoneE164}`}>
              Call the rental team {site.phoneDisplay}
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
              <span>{name}</span>
              <strong>Equipment for your base camp</strong>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="wrap section state-guide-regions">
        <div>
          <span className="eyebrow">DISTINCT TRAVEL REGIONS</span>
          <h2>Find your rental location</h2>
          <p>
            {guide.fact} Explore each regional guide for local cities, equipment
            and rental planning conditions.
          </p>
        </div>
        <nav
          aria-label={`${name} distinct travel regions`}
          className="state-guide-region-grid"
        >
          {regions.map((region) => (
            <a href={region.path} key={region.path}>
              <strong>{region.region}</strong>
              <span>{region.cities.slice(0, 3).join(", ")}</span>
              <span>{citiesForRegion(region.path).length} listed locations</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </section>
      <section className="wrap section state-guide-planning">
        <div>
          <span className="eyebrow">LOCAL AND SEASONAL INFORMATION</span>
          <h2>Rental Planning Conditions</h2>
          {guide.seasonal.summary.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <p>{guide.question}</p>
        </div>
        <aside className="region-demand-card">
          <span>Estimated seasonal facility demand</span>
          <strong>
            Code {guide.seasonal.code} · {guide.seasonal.label}
          </strong>
          <p>{guide.seasonal.basis}</p>
          <nav
            className="region-seasonal-sources"
            aria-label="Planning information sources"
          >
            {guide.seasonal.sources.map((source) => (
              <a
                href={source.href}
                key={source.href}
                rel="external noreferrer"
                target="_blank"
              >
                {source.label}
              </a>
            ))}
          </nav>
        </aside>
      </section>
      <section className="wrap section state-guide-equipment">
        <div>
          <span className="eyebrow">RENTAL EQUIPMENT</span>
          <h2>Temporary Facilities for your project</h2>
          <p>
            Rent equipment for a short assignment or discuss a longer lease.
            Confirm occupancy, utilities and site access with the rental team.
          </p>
          <ul className="state-guide-services">
            {services.map((service) => (
              <li key={service.href}>
                <a href={service.href}>
                  {capitalizeLinkLabel(labels[service.name] || service.name)}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="region-gallery">
          {guide.gallery.slice(1).map((photo) => (
            <figure key={photo.image}>
              <img
                src={photo.image}
                alt={photo.imageAlt}
                width="850"
                height="650"
                loading="lazy"
              />
              <figcaption>{photo.imageAlt}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <div className="wrap state-guide-call">
        <p>
          Emergency 24/7. Call to confirm available equipment and a rental or
          lease quote for your {name} project.
        </p>
        <a className="button" href={`tel:${site.phoneE164}`}>
          Call {site.phoneDisplay}
        </a>
      </div>
    </article>
  );
}
