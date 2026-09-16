import { stateGuides, stateAnchor } from "./stateGuides";
import { statePath } from "./statePaths";
import { regionPath } from "./regionGuides";

export function StateGuideCards() {
  return (
    <>
      {Object.entries(stateGuides).map(([name, guide]) => (
        <details
          id={stateAnchor(name)}
          data-state-guide={name}
          data-state-image={guide.image}
          data-state-image-alt={guide.imageAlt}
          data-state-image-two={guide.gallery[1].image}
          data-state-image-alt-two={guide.gallery[1].imageAlt}
          data-state-image-three={guide.gallery[2].image}
          data-state-image-alt-three={guide.gallery[2].imageAlt}
          data-state-abbreviation={guide.abbreviation}
          data-state-layout={guide.layout}
          data-state-motion={guide.motion}
          data-state-demand-code={guide.seasonal.code}
          data-state-demand-label={guide.seasonal.label}
          key={name}
        >
          <summary>
            {name}
            <span aria-hidden="true">+</span>
          </summary>
          <div>
            <h3 data-guide-focus>{guide.focus}</h3>
            <a href={statePath(name)}>View {name} rental guide</a>
            <p data-guide-intro>{guide.intro}</p>
            <div className="state-planning-regions" data-guide-regions>
              <strong>Travel regions</strong>
              <ul>
                {guide.regions.map((region) => (
                  <li key={region}>
                    <a href={regionPath(name, region)}>
                      {region} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p data-guide-fact>{guide.fact}</p>
            <p data-guide-services>{guide.serviceSummary}</p>
            <section className="state-planning-seasonal">
              <strong>Rental Planning Conditions</strong>
              <div data-guide-seasonal-copy>
                {guide.seasonal.summary.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p data-guide-demand>{guide.seasonal.basis}</p>
              <p data-guide-emergency>
                <strong>Emergency support 24/7.</strong> Call the rental team to
                confirm equipment availability and the actual dispatch schedule.
              </p>
              <ul data-guide-sources>
                {guide.seasonal.sources.map((source) => (
                  <li key={source.href}>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="external noreferrer"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
            <p className="state-planning-question">
              <strong>Before you call</strong>
              <span data-guide-question>{guide.question}</span>
            </p>
            <a href="/contact-us/" data-selected-state={name}>
              Discuss your {name} project <span aria-hidden="true">↗</span>
            </a>
          </div>
        </details>
      ))}
    </>
  );
}
