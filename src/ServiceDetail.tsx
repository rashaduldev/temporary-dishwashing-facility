import details from "../content/service-details.json" with { type: "json" };
import { serviceCategories } from "./serviceMenu";
import site from "../site.json" with { type: "json" };
import { rentalProductHeadline } from "./rentalHeadlines";
export const modelDetails = details;
export function ServiceDetail({ path }: { path: keyof typeof details }) {
  const item = details[path];
  const related = serviceCategories
    .find((c) => c.name === item.category)!
    .links.filter((l) => l.href !== path);
  return (
    <article className="model-page">
      <section className="wrap section">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/equipment-rental/">Services</a>
          <span>/</span>
          <a href={item.categoryHref}>{item.category}</a>
        </nav>
        <div className="model-hero">
          <div>
            <span className="eyebrow">EXPLORE THE CONFIGURATION</span>
            <h1>{rentalProductHeadline(item.name)}</h1>
            <p className="model-intro">{item.intro}</p>
            <div className="model-actions">
              <a className="button" href={"tel:" + site.phoneE164}>
                Call Now, {item.category} Specialist 24/7{" "}
                <span aria-hidden="true">↗</span>
              </a>
              <a className="model-call" href={"tel:" + site.phoneE164}>
                {site.phoneDisplay}
              </a>
            </div>
          </div>
          <figure>
            <img
              src={item.image}
              alt={item.alt}
              width="960"
              height="640"
              fetchPriority="high"
            />
            <figcaption>
              {item.alt}. Confirm the available unit's floor plan before
              booking.
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="model-body">
        <div className="wrap section model-information">
          <div>
            <span className="eyebrow">EQUIPMENT & LAYOUT</span>
            <h2>What this option offers</h2>
            <ul className="model-features">
              {item.equipment.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="model-highlight">{item.highlight}</p>
            <h2>Where it fits</h2>
            <p>{item.use}</p>
          </div>
          <aside className="model-planning">
            <span className="eyebrow">PLAN BEFORE DELIVERY</span>
            <h2>Check the fit for your site.</h2>
            <ol>
              {item.planning.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
            <div className="model-confirm">
              <h3>Confirm with your quote</h3>
              <p>
                {item.unknown} Availability, final equipment and service
                arrangements are confirmed in your proposal.
              </p>
            </div>
            <a href={"tel:" + site.phoneE164} className="button">
              Emergency support 24/7 <span aria-hidden="true">↗</span>
            </a>
          </aside>
        </div>
      </section>
      <section className="wrap section model-related">
        <span className="eyebrow">COMPARE THE OPTIONS</span>
        <h2>More {item.category.toLowerCase()}</h2>
        <div className="service-category-cards">
          {related.map((l) => (
            <a key={l.href} href={l.href}>
              <strong>{l.name}</strong>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
        <details className="model-source">
          <summary>Equipment information source</summary>
          <p>
            Configuration information was checked against the current client
            equipment schedule and service reference. Photographs are
            representative.{" "}
            <a href={item.source} target="_blank" rel="noopener">
              View the equipment reference ↗
            </a>
          </p>
        </details>
      </section>
    </article>
  );
}
