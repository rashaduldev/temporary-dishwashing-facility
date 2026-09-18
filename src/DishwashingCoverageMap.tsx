import { useId, useRef, useState } from "react";
import states from "./usStates.json" with { type: "json" };
import { dishwashingRoutes } from "./dishwashingConfig";
import { dishwashingPhotoCollections } from "./dishwashingImages";

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

const labelOffsets: Record<string, [number, number]> = {
  Michigan: [0, 23],
  Mississippi: [-4, 17],
  Illinois: [0, 12],
  Indiana: [0, -12],
  "West Virginia": [0, 3],
  Virginia: [17, 13],
};

const directStateRoutes: Record<string, string> = {
  Colorado: "/states/temporary-dishwashing-facility-for-lease-in-colorado-usa/",
  Wisconsin: "/states/temporary-dishwashing-facility-for-lease-in-winconsin-usa/",
};

const dishwashingFacilityPhotos = dishwashingPhotoCollections.map((collection) => ({
  image: collection.photos[0].src,
  alt: collection.photos[0].alt,
  label: collection.title,
}));

function StateMap({ gradientId, selectState }: { gradientId: string; selectState: (state: string) => void }) {
  return (
    <svg className="dw-usa-map" viewBox="-25 -15 1190 690" role="group" aria-label="Interactive map of all 50 United States">
      <defs>
        <linearGradient id={gradientId} x2="0.8" y2="1">
          <stop stopColor="#d9eeee" />
          <stop offset="1" stopColor="#9bcfce" />
        </linearGradient>
      </defs>
      <g className="dw-map-depth" transform="translate(0 4)" aria-hidden="true">
        {states.map((state) => <path key={state.id} d={state.d} />)}
      </g>
      <g className="dw-map-land" fill={`url(#${gradientId})`}>
        {states.map((state) => (
          <path
            key={state.id}
            d={state.d}
            role="button"
            tabIndex={0}
            data-state={state.name}
            aria-label={`Explore dishwashing rental planning in ${state.name}`}
            onClick={() => selectState(state.name)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectState(state.name);
              }
            }}
          >
            <title>{state.name}</title>
          </path>
        ))}
      </g>
      <g className="dw-map-labels" aria-hidden="true">
        {states.map((state) => {
          const calloutIndex = callouts.indexOf(state.name);
          const external = calloutIndex >= 0;
          const [dx, dy] = labelOffsets[state.name] ?? [0, 0];
          const x = external ? 1015 : state.x + dx;
          const y = external ? 130 + calloutIndex * 42 : state.y + dy;
          const words = external ? [state.name] : state.name.split(" ");
          return (
            <g key={state.id} className={external ? "dw-map-callout" : undefined}>
              {external && <><path className="dw-map-leader" d={`M${state.x},${state.y}L980,${y - 6}H1003`} /><circle className="dw-map-leader-point" cx={state.x} cy={state.y} r="3" /><rect className="dw-map-callout-surface" x="1003" y={y - 23} width="159" height="32" rx="6" /></>}
              <text x={x} y={y - (words.length - 1) * 7} textAnchor={external ? "start" : "middle"} className={state.name === "Mississippi" ? "dw-map-narrow-label" : undefined}>
                {words.map((word, index) => <tspan x={x} dy={index ? 15 : 0} key={word}>{word}</tspan>)}
              </text>
            </g>
          );
        })}
      </g>
      <text className="dw-map-ocean" x="990" y="520">ATLANTIC OCEAN</text>
      <text className="dw-map-ocean" x="270" y="657">ALASKA AND HAWAII SHOWN AS INSETS</text>
    </svg>
  );
}

export function DishwashingCoverageMap() {
  const gradientId = `dw-map-${useId().replace(/:/g, "")}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedState, setSelectedState] = useState("");
  const [googleMapsState, setGoogleMapsState] = useState("");
  const [photoIndex, setPhotoIndex] = useState(0);

  const selectState = (state: string) => {
    setSelectedState(state);
    setPhotoIndex(states.findIndex((item) => item.name === state) % dishwashingFacilityPhotos.length);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };

  const stateRoute = directStateRoutes[selectedState] || dishwashingRoutes.serviceAreas;
  const googleMapsUrl = googleMapsState
    ? `https://www.google.com/maps/place/${encodeURIComponent(googleMapsState)}/`
    : "https://www.google.com/maps/place/United+States/";
  const activePhoto = dishwashingFacilityPhotos[photoIndex];
  const changePhoto = (direction: number) => {
    setPhotoIndex((current) => (current + direction + dishwashingFacilityPhotos.length) % dishwashingFacilityPhotos.length);
  };

  return (
    <figure className="dw-coverage-map" aria-labelledby="dw-coverage-map-title">
      <div className="dw-coverage-map-topline">
        <span id="dw-coverage-map-title">Find your state</span>
        <strong>50 states</strong>
      </div>
      <p className="dw-coverage-map-intro">Select a state on the map or choose one from the list. Coverage and delivery still require confirmation.</p>
      <div className="dw-coverage-map-stage"><StateMap gradientId={gradientId} selectState={selectState} /></div>
      <div className="dw-map-controls">
        <label htmlFor={`${gradientId}-picker`}>
          Choose your state
          <select
            id={`${gradientId}-picker`}
            value={googleMapsState}
            onChange={(event) => setGoogleMapsState(event.target.value)}
          >
            <option value="" disabled>Select a state</option>
            {[...states].sort((a, b) => a.name.localeCompare(b.name)).map((state) => <option key={state.id} value={state.name}>{state.name}</option>)}
          </select>
        </label>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          {googleMapsState ? `Open ${googleMapsState} in Google Maps` : "Open Google Maps"} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <figcaption>Includes Alaska and Hawaii. Map boundaries are based on U.S. Census Bureau geography. No state-level availability is implied.</figcaption>

      <dialog
        ref={dialogRef}
        className="dw-state-map-dialog"
        aria-labelledby="dw-state-map-dialog-title"
        onCancel={() => dialogRef.current?.close()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <button type="button" className="dw-state-map-close" aria-label="Close state planning dialog" onClick={() => dialogRef.current?.close()}>×</button>
        <div className="dw-state-modal-grid">
          <div className="dw-state-modal-gallery">
            <div className="dw-state-modal-photo">
              <img src={activePhoto.image} alt={`${activePhoto.alt} — representative equipment for ${selectedState || "the selected state"}`} width="850" height="650" />
              <button type="button" className="dw-state-photo-control dw-state-photo-prev" aria-label="Show previous dishwashing facility photo" onClick={() => changePhoto(-1)}>←</button>
              <button type="button" className="dw-state-photo-control dw-state-photo-next" aria-label="Show next dishwashing facility photo" onClick={() => changePhoto(1)}>→</button>
              <span className="dw-state-photo-count">{photoIndex + 1} / {dishwashingFacilityPhotos.length}</span>
            </div>
            <div className="dw-state-photo-meta">
              <strong>{activePhoto.label}</strong>
              <div className="dw-state-photo-dots" aria-label="Choose a facility photo">
                {dishwashingFacilityPhotos.map((photo, index) => (
                  <button
                    type="button"
                    key={photo.image}
                    className={index === photoIndex ? "is-active" : undefined}
                    aria-label={`Show photo ${index + 1}: ${photo.label}`}
                    aria-current={index === photoIndex ? "true" : undefined}
                    onClick={() => setPhotoIndex(index)}
                  />
                ))}
              </div>
            </div>
            <p className="dw-state-photo-note">Original equipment-library photos, grouped by configuration family. Images do not establish inventory, availability or a completed deployment in {selectedState || "this state"}.</p>
          </div>

          <div className="dw-state-modal-content">
            <p className="dw-eyebrow">{selectedState || "State"} service planning</p>
            <h2 id="dw-state-map-dialog-title">Temporary dishwashing facilities for rent in {selectedState || "your state"}</h2>
            <p className="dw-state-modal-lead">Start with the operating brief, then confirm the exact site, model, delivery route and requested dates with the rental team.</p>
            <div className="dw-state-detail-list">
              <article>
                <span>01</span>
                <div><strong>Dish volume and workflow</strong><p>Share peak meal counts, ware types, rack volume and the return window from dining to the wash line.</p></div>
              </article>
              <article>
                <span>02</span>
                <div><strong>Site and utility review</strong><p>Confirm a level setup area, delivery access, power, potable water, drainage and the wastewater approach.</p></div>
              </article>
              <article>
                <span>03</span>
                <div><strong>Configuration and availability</strong><p>Match the model to the clean and soiled workflow, then verify equipment, timing and delivery feasibility.</p></div>
              </article>
            </div>
            <div className="dw-state-map-actions">
              <a className="dw-button dw-button-primary" href={stateRoute}>{directStateRoutes[selectedState] ? `Open the ${selectedState} planning guide` : "Review service-area planning"}</a>
              <a className="dw-button dw-button-quiet" href={dishwashingRoutes.contact}>Request availability</a>
            </div>
          </div>
        </div>
      </dialog>
    </figure>
  );
}
