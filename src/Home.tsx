import { RentalCalculator } from "./RentalCalculator";
import { DishwashingCoverageMap } from "./DishwashingCoverageMap";
import {
  homepageContent,
  industries,
  models,
  resources,
} from "./dishwashingContent";
import { dishwashingRoutes, siteConfig } from "./dishwashingConfig";

export type HomeProps = {
  openContact: () => void;
};

const processSteps = [
  {
    number: "01",
    title: "Define the wash volume",
    body: "Document peak meal windows, ware types, soiled-item arrival, staffing and clean-storage needs.",
  },
  {
    number: "02",
    title: "Check the site",
    body: "Confirm access, placement, potable water, power, wastewater handling and the authority responsible for approval.",
  },
  {
    number: "03",
    title: "Verify the configuration",
    body: "Match the proposed model, machine, workflow and schedule to the project before availability or delivery is confirmed.",
  },
] as const;

const faqs = [
  {
    question: "What should I prepare before requesting availability?",
    answer:
      "Bring the project location, requested dates, operating schedule, peak meal or ware volume, access limits, known utilities and wastewater plan. The team will still need to confirm the final configuration.",
  },
  {
    question: "Does the calculator provide a final rental quote?",
    answer:
      "No. It provides a starting equipment-and-length-based delivery estimate. Rental duration, location, access, utilities, availability and project-specific charges require confirmation.",
  },
  {
    question: "Are the photographs the exact trailer I will receive?",
    answer:
      "Not necessarily. The current photographs show representative temporary dishwashing interiors. Exact-model photographs and specifications are shown only after they are verified.",
  },
  {
    question: "Can you help with a time-sensitive requirement?",
    answer:
      "Call the number shown on this site and explain the location, timing and operational impact. Staffing hours, current availability and delivery timing must be confirmed during that conversation.",
  },
] as const;

export function Home({ openContact }: HomeProps) {
  return (
    <div className="dw-home">
      <section className="dw-hero" aria-labelledby="home-title">
        <div className="dw-shell dw-hero-grid">
          <div className="dw-hero-copy">
            <p className="dw-eyebrow">{homepageContent.eyebrow}</p>
            <h1 id="home-title">
              <span>Temporary Commercial</span>{" "}
              Dishwashing{" "}
              <em>Facility Rentals</em>
            </h1>
            <p className="dw-lede">{homepageContent.introduction}</p>
            <div className="dw-actions">
              <a className="dw-button dw-button-primary" href={dishwashingRoutes.equipment}>
                Compare the four models <span aria-hidden="true">↗</span>
              </a>
              <button className="dw-button dw-button-quiet" type="button" onClick={openContact}>
                Request rental availability
              </button>
            </div>
            <dl className="dw-hero-facts" aria-label="Planning commitments">
              <div>
                <dt>4 models</dt>
                <dd>model footprints to compare</dd>
              </div>
              <div>
                <dt>No contact gate</dt>
                <dd>build a starting estimate before you inquire</dd>
              </div>
              <div>
                <dt>Direct confirmation</dt>
                <dd>verify equipment, utilities and availability</dd>
              </div>
            </dl>
          </div>

          <div className="dw-hero-media">
            <figure className="dw-hero-photo">
              <img
                src="/media/cc7bd709e3c4c4a3698b1f00.webp"
                alt="Stainless steel sinks, pre-rinse equipment, worktables and storage racks inside a temporary dishwashing facility"
                width="850"
                height="650"
                fetchPriority="high"
              />
              <figcaption>
                <span>Representative commercial dishwashing interior</span>
                <small>Confirm the exact model and installed equipment.</small>
              </figcaption>
            </figure>
            <div className="dw-hero-note">
              <span aria-hidden="true">◌</span>
              <p>
                <strong>Plan the whole workflow.</strong>
                Soil side, wash path, clean storage, utilities and site access belong in one conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dw-section dw-shell" aria-labelledby="models-title">
        <div className="dw-section-heading">
          <div>
            <p className="dw-eyebrow">Four model designations</p>
            <h2 id="models-title">Start with footprint. Verify every detail.</h2>
          </div>
          <p>
            These model pages intentionally leave machine, capacity, utility and availability fields unknown until evidence is approved.
          </p>
        </div>
        <div className="dw-model-grid">
          {models.map((model, index) => (
            <article className="dw-model-card" key={model.id}>
              <div className="dw-model-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="dw-model-length">{model.nominalLengthFeet} FT</p>
              <h3>{model.shortName}</h3>
              <p>{model.summary}</p>
              <ul aria-label={`${model.shortName} verification status`}>
                <li>Configuration: {model.configuration}</li>
                <li>Availability: confirmation required</li>
                <li>Exact model photo: not yet verified</li>
              </ul>
              <a href={model.route}>
                Review this model <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="dw-section dw-section-tint" aria-labelledby="calculator-preview-title">
        <div className="dw-shell">
          <RentalCalculator
            className="dw-calculator-preview"
            title="Build a starting dishwashing rental estimate"
          />
          <p className="dw-calculator-link">
            Need more room to plan? <a href={dishwashingRoutes.calculator}>Open the dedicated calculator.</a>
          </p>
        </div>
      </section>

      <section className="dw-section dw-shell" aria-labelledby="workflow-title">
        <div className="dw-section-heading">
          <div>
            <p className="dw-eyebrow">A useful project brief</p>
            <h2 id="workflow-title">Three decisions before the trailer moves.</h2>
          </div>
          <p>
            The goal is a workable temporary operation, not simply a trailer at the curb.
          </p>
        </div>
        <ol className="dw-process-grid">
          {processSteps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="dw-section dw-industries" aria-labelledby="industries-title">
        <div className="dw-shell dw-industry-layout">
          <div className="dw-industry-intro">
            <p className="dw-eyebrow">Commercial and institutional</p>
            <h2 id="industries-title">Plan around the operation you cannot pause.</h2>
            <p>
              Different facilities bring different service windows, access controls, ware types and approval paths. The equipment discussion starts with those realities.
            </p>
            <a className="dw-text-link" href={dishwashingRoutes.industries}>
              Explore industries served <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="dw-industry-grid">
            {industries.map((industry) => (
              <article key={industry.title}>
                <h3>{industry.title}</h3>
                <p>{industry.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dw-section dw-map-section" aria-labelledby="home-map-title">
        <div className="dw-shell dw-map-section-layout">
          <div className="dw-map-section-copy">
            <p className="dw-eyebrow">Service-area planning</p>
            <h2 id="home-map-title">Find dishwashing rental planning by state.</h2>
            <p>Select a state to start a location-specific planning conversation. The map is a navigation aid—not a claim of inventory, guaranteed coverage or delivery timing.</p>
            <a className="dw-text-link" href={dishwashingRoutes.serviceAreas}>Browse service-area guidance <span aria-hidden="true">↗</span></a>
          </div>
          <DishwashingCoverageMap />
        </div>
      </section>

      <section className="dw-section dw-shell" aria-labelledby="resources-title">
        <div className="dw-section-heading">
          <div>
            <p className="dw-eyebrow">Planning library</p>
            <h2 id="resources-title">Questions worth answering early.</h2>
          </div>
          <p>
            Use these guides to prepare a stronger project brief. They do not replace engineering, permitting or environmental review.
          </p>
        </div>
        <div className="dw-resource-grid">
          {resources.map((resource) => (
            <article key={resource.href}>
              <p>FIELD NOTE</p>
              <h3>{resource.title}</h3>
              <p>{resource.summary}</p>
              <a href={resource.href}>Read the planning guide <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="dw-section dw-faq" aria-labelledby="faq-title">
        <div className="dw-shell dw-faq-layout">
          <div>
            <p className="dw-eyebrow">Straight answers</p>
            <h2 id="faq-title">Know what is confirmed—and what is not.</h2>
            <a className="dw-phone-link" href={`tel:${siteConfig.phoneE164}`}>
              Call {siteConfig.phoneDisplay}
            </a>
            {!siteConfig.phoneVerified && (
              <small>Number observed on the current site; ownership confirmation is pending.</small>
            )}
          </div>
          <div>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
