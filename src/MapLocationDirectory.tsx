import { stateGuides } from "./stateGuides";
import { statePath } from "./statePaths";
import { regionPath } from "./regionGuides";
import { reviewedCityPages } from "./cityDirectory";

export function MapLocationDirectory() {
  return (
    <section
      className="map-location-directory"
      aria-label="Browse rental locations"
    >
      <h3>Browse rental locations</h3>
      <p>
        Open a state guide directly, or expand its regions and published city
        guides. Confirm availability for your exact site and dates.
      </p>
      <div className="map-location-grid">
        {Object.entries(stateGuides)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([name, guide]) => (
            <div key={name}>
              <a className="map-location-state" href={statePath(name)}>
                {name}
              </a>
              <details>
                <summary>Regions and cities in {name}</summary>
                <ul>
                  {guide.regions.map((region) => (
                    <li key={region}>
                      <a href={regionPath(name, region)}>{region}</a>
                    </li>
                  ))}
                  {reviewedCityPages
                    .filter((city) => city.state === name)
                    .map((city) => (
                      <li key={city.path}>
                        <a data-directory-city href={city.path}>
                          {city.name}, {name}
                        </a>
                      </li>
                    ))}
                </ul>
              </details>
            </div>
          ))}
      </div>
    </section>
  );
}
