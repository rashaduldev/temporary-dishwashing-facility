import { citiesForRegion, hasCityGuide } from "./cityDirectory";
import type { RegionGuide } from "./regionGuides";
import { regionLocationLabel } from "./rentalHeadlines";
import { statePath } from "./statePaths";

export function CityDirectoryPage({ guide }: { guide: RegionGuide }) {
  const cities = citiesForRegion(guide.path);
  const groups = new Map<string, typeof cities>();
  for (const city of cities) {
    const letter = city.name[0].toUpperCase();
    const group = groups.get(letter) || [];
    group.push(city);
    groups.set(letter, group);
  }
  return (
    <article className="city-directory-page">
      <div className="wrap city-directory-shell">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <a href="/service-areas/">Service Areas</a>
          <span>/</span>
          <a href={statePath(guide.state)}>{guide.state}</a>
          <span>/</span>
          <a href={guide.path}>{guide.region}</a>
          <span>/</span>
          <span aria-current="page">Cities</span>
        </nav>
        <header className="city-directory-heading">
          <div>
            <span className="eyebrow">REGIONAL CITY DIRECTORY</span>
            <h1>
              {regionLocationLabel(guide.region, guide.state)} Facility Rental
              Locations
            </h1>
            <p>
              Explore {cities.length} Census-listed {guide.region},{" "}
              {guide.state}
              locations. Select a linked city for a detailed rental guide, or
              use the regional guide to plan facilities anywhere in this area.
            </p>
            <a className="button secondary" href={guide.path}>
              View {guide.region} Rental Services
            </a>
          </div>
          <div className="city-directory-count">
            <strong>{cities.length}</strong>
            <span>locations</span>
          </div>
        </header>
        <div className="city-directory-toolbar">
          <label htmlFor="city-directory-search">Find a city</label>
          <input
            id="city-directory-search"
            type="search"
            placeholder={`Search ${guide.region} cities`}
            autoComplete="off"
          />
          <span id="city-directory-status" role="status">
            {cities.length} locations
          </span>
        </div>
        <div className="city-directory-groups">
          {[...groups]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, places]) => (
              <section
                className="city-directory-group"
                key={letter}
                aria-label={`${letter} cities`}
              >
                <h2>{letter}</h2>
                <div className="city-directory-grid">
                  {places.map((city) =>
                    hasCityGuide(city) ? (
                      <a
                        href={city.path}
                        data-city-item
                        data-city-name={city.name.toLowerCase()}
                        key={city.geoid}
                      >
                        {city.name}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span
                        data-city-item
                        data-city-name={city.name.toLowerCase()}
                        key={city.geoid}
                      >
                        {city.name}
                      </span>
                    ),
                  )}
                </div>
              </section>
            ))}
        </div>
        <p className="city-directory-source">
          Place identities use the U.S. Census Bureau's 2026 Places Gazetteer.
          Travel-region assignments are planning groupings; confirm the exact
          project address with the rental team.{" "}
          <a
            href="https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html"
            rel="external noreferrer"
            target="_blank"
          >
            View the Census source ↗
          </a>
        </p>
      </div>
    </article>
  );
}
