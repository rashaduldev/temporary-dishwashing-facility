import states from "./usStates.json" with { type: "json" };
import { reviewedCityPages } from "./cityDirectory";
import { StateGuideCards } from "./StateGuideCards";
import { MapLocationDirectory } from "./MapLocationDirectory";
import { serviceCategories } from "./serviceMenu";
import site from "../site.json" with { type: "json" };
const callouts = [
  "Vermont",
  "New Hampshire",
  "Massachusetts",
  "Rhode Island",
  "Connecticut",
  "New Jersey",
  "Delaware",
  "Maryland",
];
const baseCampServicePriority = new Map([
  ["Mobile Kitchens", 0],
  ["Shower and Restroom Combination Trailers", 1],
  ["Shower", 2],
  ["Sleeper", 3],
]);
const stateServiceLabels: Record<string, string> = {
  "Mobile Kitchens": "Mobile commercial kitchen rentals",
  "Shower and Restroom Combination Trailers":
    "Shower and restroom combination trailers",
  Shower: "22 ft shower trailer rental, 10 stalls",
  Sleeper: "Sleeper and bunkbed trailer rentals",
  Dishwashing: "Dishwashing trailer rentals",
  Refrigeration: "Refrigeration trailer rentals",
  Restroom: "Restroom trailer rentals",
  Laundry: "Laundry trailer rentals",
  "Handwashing Trailers": "Handwashing trailer rentals",
};
const stateServices = [...serviceCategories].sort((left, right) => {
  const leftPriority = baseCampServicePriority.get(left.name) ?? 10;
  const rightPriority = baseCampServicePriority.get(right.name) ?? 10;
  return leftPriority - rightPriority;
});
const mapCitiesByState = states
  .map((state) => ({
    state: state.name,
    cities: reviewedCityPages
      .filter((city) => city.state === state.name)
      .sort(
        (left, right) =>
          left.name.localeCompare(right.name) ||
          left.region.localeCompare(right.region),
      ),
  }))
  .filter(({ cities }) => cities.length > 0);
// Offset labels within nearby state interiors where centered names would overlap.
const labelOffsets: Record<string, [number, number]> = {
  Michigan: [0, 23],
  Mississippi: [-4, 17],
  Illinois: [0, 12],
  Indiana: [0, -12],
  "West Virginia": [0, 3],
  Virginia: [17, 13],
};
function Geography({ id }: { id: string }) {
  return (
    <svg
      className="usa-geography"
      viewBox="-25 -15 1190 690"
      role="group"
      aria-label="Geographic map of all 50 US states, each labeled with its full name"
    >
      <defs>
        <linearGradient id={id} x2="0.8" y2="1">
          <stop stopColor="#d9eeee" />
          <stop offset="1" stopColor="#a5d7d7" />
        </linearGradient>
      </defs>
      <g className="map-depth" transform="translate(0 3)" aria-hidden="true">
        {states.map((s) => (
          <path key={s.id} d={s.d} />
        ))}
      </g>
      <g className="map-land" fill={`url(#${id})`}>
        {states.map((s) => (
          <path
            key={s.id}
            d={s.d}
            role="button"
            tabIndex={0}
            data-state={s.name}
            aria-label={`Explore services in ${s.name}`}
            aria-haspopup="dialog"
            aria-controls="state-services-dialog"
          >
            <title>{s.name}</title>
          </path>
        ))}
      </g>
      <g className="map-labels">
        {states.map((s) => {
          const index = callouts.indexOf(s.name),
            external = index >= 0;
          const [dx, dy] = labelOffsets[s.name] ?? [0, 0];
          const x = external ? 1015 : s.x + dx;
          const y = external ? 130 + index * 42 : s.y + dy;
          const words = external ? [s.name] : s.name.split(" ");
          return (
            <g key={s.id} className={external ? "map-callout" : undefined}>
              {external && (
                <>
                  <path
                    className="map-leader"
                    d={`M${s.x},${s.y}L980,${y - 6}H1003`}
                  />
                  <circle
                    className="map-leader-point"
                    cx={s.x}
                    cy={s.y}
                    r="3"
                  />
                  <rect
                    className="map-callout-surface"
                    x="1003"
                    y={y - 23}
                    width="159"
                    height="32"
                    rx="6"
                  />
                </>
              )}
              <text
                x={x}
                className={
                  ["Hawaii"].includes(s.name)
                    ? "map-island-label"
                    : s.name === "Mississippi"
                      ? "map-narrow-label"
                      : undefined
                }
                y={y - (words.length - 1) * 7}
                textAnchor={external ? "start" : "middle"}
              >
                {words.map((w, i) => (
                  <tspan x={x} dy={i ? 15 : 0} key={i}>
                    {w}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </g>
      <text className="map-ocean" x="990" y="520">
        ATLANTIC OCEAN
      </text>
      <text className="map-ocean" x="270" y="657">
        ALASKA AND HAWAII SHOWN AS INSETS
      </text>
    </svg>
  );
}
export function CoverageMap({
  compact = false,
  showDirectory = true,
}: {
  compact?: boolean;
  showDirectory?: boolean;
}) {
  return (
    <>
      <figure className="coverage-map" aria-labelledby="coverage-map-title">
        <template id="map-state-guides">
          <StateGuideCards />
        </template>
        <div className="coverage-map-topline">
          <span id="coverage-map-title">Find your state</span>
          <strong>50 states</strong>
        </div>
        <p className="coverage-map-intro">
          Select a state on the map or choose from the list below.
        </p>
        <div className="coverage-map-stage">
          <Geography id="map-surface" />
        </div>
        <div className="map-controls">
          <div className="map-state-picker">
            <label htmlFor="coverage-state-picker">Choose your state</label>
            <select
              id="coverage-state-picker"
              data-state-picker
              defaultValue=""
            >
              <option value="" disabled>
                Select a state
              </option>
              {[...states]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="map-tools">
            <button type="button" data-expand-map aria-haspopup="dialog">
              Explore full map <span aria-hidden="true">↗</span>
            </button>
            <a
              href="https://www.google.com/maps/place/United+States/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Google Maps <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <figcaption>
          Includes Alaska and Hawaii. Availability and delivery timing depend on
          your site and dates. Map boundaries: U.S. Census Bureau.
        </figcaption>
        <dialog className="map-dialog" aria-label="USA service coverage map">
          <div className="map-dialog-heading">
            <strong>All 50 states. One point of contact.</strong>
            <button
              type="button"
              data-close-map
              aria-label="Close coverage map"
            >
              Close ×
            </button>
          </div>
          <p>
            Scroll across the map on smaller screens to read every state name.
          </p>
          <div
            className="map-large-scroll"
            tabIndex={0}
            role="region"
            aria-label="Scrollable full-size state map"
          >
            <Geography id="large-map-surface" />
          </div>
        </dialog>
        {compact ? (
          <dialog
            id="state-services-dialog"
            className="state-preview-dialog"
            aria-labelledby="state-services-title"
            aria-describedby="state-services-intro"
          >
            <button
              type="button"
              data-close-state
              aria-label="Close state services"
            >
              Close ×
            </button>
            <h2 id="state-services-title">
              <span data-state-name>Your state</span> Rental Services
            </h2>
            <p id="state-services-intro">
              Confirm rental availability for your project location.
            </p>
            <a className="button" data-state-page href="/service-areas/">
              View state rental services ↗
            </a>
          </dialog>
        ) : (
          <dialog
            id="state-services-dialog"
            className="state-services-dialog"
            aria-labelledby="state-services-title"
            aria-describedby="state-services-intro"
          >
            <div className="state-dialog-composition">
              <div className="state-services-heading">
                <p className="eyebrow">
                  <span>Temporary facilities across the USA.</span>
                  <span className="state-dialog-code" data-state-code>
                    State 01 of 50
                  </span>
                </p>
                <button
                  type="button"
                  data-close-state
                  aria-label="Close state services"
                >
                  ×
                </button>
              </div>

              <section className="state-dialog-story">
                <div className="state-dialog-copy">
                  <p className="state-dialog-focus" data-state-focus>
                    Plan for the exact site
                  </p>
                  <h2 id="state-services-title">
                    <span data-state-name>Your state</span> Rental Services{" "}
                    <small>Temporary Facilities to Rent or Lease</small>
                  </h2>
                  <p id="state-services-intro">
                    Temporary facility rental services are available for
                    projects in <span data-state-name>your state</span>, USA.
                    Customers can rent equipment for short-term projects or
                    request a longer lease for projects across the United
                    States.
                  </p>
                  <p className="state-service-summary" data-state-services-copy>
                    Base camp rentals include mobile commercial kitchens, shower
                    trailers, shower and restroom combinations, and
                    sleeper/bunkbed trailers. Supporting temporary facilities
                    are also available.
                  </p>
                  <p className="state-dialog-question" data-state-question />
                </div>

                <aside className="state-region-panel">
                  <span className="state-region-kicker">
                    Distinct travel regions
                  </span>
                  <h3>
                    Explore <span data-state-name>your state</span> by region
                  </h3>
                  <p>
                    Select a travel region to open its dedicated rental and
                    lease guide on this website.
                  </p>
                  <nav
                    className="state-modal-regions"
                    data-state-regions
                    aria-label="Distinct travel regions"
                  >
                    <a href="/service-areas/">Choose a travel region</a>
                  </nav>
                  <a
                    className="state-guide-link"
                    data-state-page
                    href="/service-areas/"
                  >
                    View state rental guide ↗
                  </a>
                  <div className="state-fact-card">
                    <strong>State fact</strong>
                    <span data-state-fact>
                      Confirm the exact project location.
                    </span>
                  </div>
                </aside>
              </section>

              <section
                className="state-dialog-seasonal"
                aria-labelledby="state-seasonal-title"
              >
                <div className="state-seasonal-heading">
                  <span className="eyebrow">
                    LOCAL AND SEASONAL INFORMATION
                  </span>
                  <h3 id="state-seasonal-title">
                    Rental Planning Conditions in{" "}
                    <span data-state-name>your state</span>
                  </h3>
                </div>
                <div className="state-seasonal-copy" data-state-seasonal-copy />
                <div className="state-demand-card">
                  <span>Estimated demand</span>
                  <strong data-state-demand-code>Code 3 · Moderate</strong>
                  <p data-state-demand>
                    This is an estimated planning indicator, not an official
                    government risk rating.
                  </p>
                </div>
                <nav
                  className="state-seasonal-sources"
                  data-state-seasonal-sources
                  aria-label="Planning information sources"
                />
              </section>

              <section
                className="state-dialog-visual"
                aria-label="Temporary123 equipment photographs"
              >
                <div className="state-visual-heading">
                  <div>
                    <span>Equipment references</span>
                    <strong>
                      Options for <span data-state-name>your state</span>
                    </strong>
                  </div>
                  <span className="state-visual-monogram" data-state-initials>
                    US
                  </span>
                </div>
                <div className="state-dialog-photo-grid">
                  <figure>
                    <div>
                      <img
                        src="/images/catalog/mobile-kitchen-trailers-960.webp"
                        alt="Commercial equipment inside a mobile kitchen trailer"
                        width="850"
                        height="650"
                        data-state-image
                      />
                      <span aria-hidden="true">01</span>
                    </div>
                    <figcaption data-state-image-caption>
                      Commercial equipment inside a mobile kitchen trailer
                    </figcaption>
                  </figure>
                  <figure>
                    <div>
                      <img
                        src="/images/catalog/shower-trailer-960.webp"
                        alt="Interior of a mobile shower trailer"
                        width="850"
                        height="650"
                        data-state-gallery-image="1"
                      />
                      <span aria-hidden="true">02</span>
                    </div>
                    <figcaption data-state-gallery-caption="1">
                      Interior of a mobile shower trailer
                    </figcaption>
                  </figure>
                  <figure>
                    <div>
                      <img
                        src="/images/catalog/mobile-kitchen-trailers-960.webp"
                        alt="Temporary123 rental equipment"
                        width="850"
                        height="650"
                        data-state-gallery-image="2"
                      />
                    </div>
                    <figcaption data-state-gallery-caption="2">
                      Temporary123 rental equipment
                    </figcaption>
                  </figure>
                </div>
              </section>

              <section
                className="state-dialog-services"
                aria-label="Temporary facility rental services"
              >
                <div className="state-service-heading">
                  <span>Base camp and supporting rentals</span>
                  <strong>9 facility types</strong>
                </div>
                <ul className="state-service-list">
                  {stateServices.map((service, index) => (
                    <li
                      className={
                        baseCampServicePriority.has(service.name)
                          ? "basecamp-service"
                          : undefined
                      }
                      key={service.href}
                    >
                      <a href={service.href}>
                        <span
                          className="state-service-number"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          {stateServiceLabels[service.name] || service.name}
                        </span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                className="state-dialog-cities"
                data-state-cities
                aria-labelledby="state-cities-title"
                hidden
              >
                <div className="state-city-heading">
                  <span>Published local guides</span>
                  <h3 id="state-cities-title">
                    Cities served in <span data-state-name>your state</span>
                  </h3>
                  <p>
                    Choose a city to read its reviewed rental guide. For other
                    locations, use the state or regional guide and confirm the
                    exact project address with our rental team.
                  </p>
                </div>
                <div className="state-city-groups">
                  {mapCitiesByState.map(({ state, cities }) => (
                    <nav
                      key={state}
                      data-map-city-state={state}
                      aria-label={`${state} city rental guides`}
                      hidden
                    >
                      {cities.map((city) => (
                        <a href={city.path} key={city.geoid}>
                          <strong>{city.name}</strong>
                          <span>{city.region}</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </nav>
                  ))}
                </div>
              </section>

              <div className="state-services-cta">
                <div>
                  <h3>Need a trailer now?</h3>
                  <p>
                    Speak directly with our USA rental team, available 24/7.
                  </p>
                </div>
                <a
                  className="button state-call-now"
                  href={`tel:${site.phoneE164}`}
                  aria-label={`Call now ${site.phoneDisplay}`}
                >
                  Call Now <strong>{site.phoneDisplay}</strong>{" "}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
              <p className="state-services-call">
                Prefer to call?{" "}
                <a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>
                <span>Available 24/7</span>
              </p>
            </div>
          </dialog>
        )}
      </figure>
      {showDirectory && <MapLocationDirectory />}
    </>
  );
}
