import { useId, useRef, useState } from "react";
import states from "./usStates.json" with { type: "json" };
import { dishwashingRoutes } from "./dishwashingConfig";

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

  const selectState = (state: string) => {
    setSelectedState(state);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };

  const stateRoute = directStateRoutes[selectedState] || dishwashingRoutes.serviceAreas;

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
          <select id={`${gradientId}-picker`} value="" onChange={(event) => selectState(event.target.value)}>
            <option value="" disabled>Select a state</option>
            {[...states].sort((a, b) => a.name.localeCompare(b.name)).map((state) => <option key={state.id} value={state.name}>{state.name}</option>)}
          </select>
        </label>
        <a href="https://www.google.com/maps/place/United+States/" target="_blank" rel="noopener noreferrer">Open Google Maps <span aria-hidden="true">↗</span></a>
      </div>
      <figcaption>Includes Alaska and Hawaii. Map boundaries are based on U.S. Census Bureau geography. No state-level availability is implied.</figcaption>

      <dialog ref={dialogRef} className="dw-state-map-dialog" aria-labelledby="dw-state-map-dialog-title" onCancel={() => dialogRef.current?.close()}>
        <button type="button" className="dw-state-map-close" aria-label="Close state planning dialog" onClick={() => dialogRef.current?.close()}>×</button>
        <p className="dw-eyebrow">Project location</p>
        <h2 id="dw-state-map-dialog-title">{selectedState || "State"} dishwashing rental planning</h2>
        <p>Use the state as a starting point, then confirm the exact site, access, utilities, wastewater plan, requested dates and equipment availability.</p>
        <div className="dw-state-map-actions">
          <a className="dw-button dw-button-primary" href={stateRoute}>{directStateRoutes[selectedState] ? "Open state planning guide" : "Review service-area planning"}</a>
          <a className="dw-button dw-button-quiet" href={dishwashingRoutes.contact}>Prepare an availability request</a>
        </div>
      </dialog>
    </figure>
  );
}
