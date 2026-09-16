import { useId, useState } from "react";
import {
  calculatePlanningEstimate,
  DISHWASHING_MODELS,
  findDishwashingModel,
  US_STATES,
} from "./calculatorData";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export type RentalCalculatorProps = {
  className?: string;
  title?: string;
};

export function RentalCalculator({
  className = "",
  title = "Plan your temporary dishwashing rental",
}: RentalCalculatorProps) {
  const prefix = useId();
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [modelId, setModelId] = useState(DISHWASHING_MODELS[0].id);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const model = findDishwashingModel(modelId) ?? DISHWASHING_MODELS[0];
  const estimate = calculatePlanningEstimate(model.lengthFeet);
  const dateError =
    startDate && endDate && endDate < startDate
      ? "The return date must be on or after the delivery date."
      : "";
  const zipError =
    zip && !/^\d{5}(?:-\d{4})?$/.test(zip)
      ? "Enter a 5-digit ZIP code or ZIP+4."
      : "";

  const id = (field: string) => `${prefix}-${field}`;

  return (
    <section
      className={`rental-calculator ${className}`.trim()}
      aria-labelledby={id("title")}
    >
      <div className="rental-calculator__intro">
        <p className="rental-calculator__eyebrow">Planning estimate</p>
        <h2 id={id("title")}>{title}</h2>
        <p>
          Choose a model to see a provisional equipment-and-delivery estimate.
          The pricing inputs still require owner approval, and no contact
          information is required.
        </p>
      </div>

      <div className="rental-calculator__workspace">
        <form
          className="rental-calculator__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <fieldset>
            <legend>Project location</legend>
            <div className="rental-calculator__grid">
              <label htmlFor={id("state")}>
                State
                <select
                  id={id("state")}
                  name="state"
                  value={state}
                  onChange={(event) => setState(event.currentTarget.value)}
                >
                  <option value="">Select a state</option>
                  {US_STATES.map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor={id("city")}>
                City
                <input
                  id={id("city")}
                  name="city"
                  autoComplete="address-level2"
                  maxLength={100}
                  value={city}
                  onChange={(event) => setCity(event.currentTarget.value)}
                />
              </label>

              <label htmlFor={id("zip")}>
                <span className="rental-calculator__label-row">
                  ZIP code
                  <span className="rental-calculator__optional">Optional</span>
                </span>
                <input
                  id={id("zip")}
                  name="postalCode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000"
                  maxLength={10}
                  value={zip}
                  aria-invalid={Boolean(zipError)}
                  aria-describedby={zipError ? id("zip-error") : undefined}
                  onChange={(event) => setZip(event.currentTarget.value.trim())}
                />
                {zipError && (
                  <span
                    id={id("zip-error")}
                    className="rental-calculator__error"
                  >
                    {zipError}
                  </span>
                )}
              </label>
            </div>
            <p className="rental-calculator__field-note">
              Location helps describe your project. This baseline is not
              distance-, city-, or ZIP-based.
            </p>
          </fieldset>

          <fieldset>
            <legend>Equipment</legend>
            <div className="rental-calculator__grid rental-calculator__grid--equipment">
              <label htmlFor={id("equipment")}>
                Equipment type
                <select
                  id={id("equipment")}
                  name="equipment"
                  defaultValue="dishwashing"
                >
                  <option value="dishwashing">
                    Temporary dishwashing facility
                  </option>
                </select>
              </label>

              <label htmlFor={id("model")}>
                Model and trailer length
                <select
                  id={id("model")}
                  name="model"
                  value={modelId}
                  onChange={(event) =>
                    setModelId(event.currentTarget.value as typeof modelId)
                  }
                >
                  {DISHWASHING_MODELS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor={id("length")}>
                Trailer length
                <input
                  id={id("length")}
                  name="trailerLength"
                  value={`${model.lengthFeet} ft`}
                  readOnly
                  aria-readonly="true"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Estimated rental dates</legend>
            <div className="rental-calculator__grid rental-calculator__grid--dates">
              <label htmlFor={id("start-date")}>
                Delivery date
                <input
                  id={id("start-date")}
                  name="startDate"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.currentTarget.value)}
                />
              </label>
              <label htmlFor={id("end-date")}>
                Return date
                <input
                  id={id("end-date")}
                  name="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  aria-invalid={Boolean(dateError)}
                  aria-describedby={
                    dateError ? id("date-error") : id("date-note")
                  }
                  onChange={(event) => setEndDate(event.currentTarget.value)}
                />
                {dateError && (
                  <span
                    id={id("date-error")}
                    className="rental-calculator__error"
                  >
                    {dateError}
                  </span>
                )}
              </label>
            </div>
            <p id={id("date-note")} className="rental-calculator__field-note">
              Dates do not change this estimate until rental-period pricing is
              available.
            </p>
          </fieldset>
        </form>

        <aside
          className="rental-calculator__result"
          aria-labelledby={id("estimate-title")}
        >
          <p className="rental-calculator__eyebrow">Your starting estimate</p>
          <h3 id={id("estimate-title")}>{model.name}</h3>
          {estimate ? (
            <output
              aria-live="polite"
              htmlFor={`${id("model")} ${id("length")}`}
            >
              <dl className="rental-calculator__breakdown">
                <div>
                  <dt>Provisional equipment input</dt>
                  <dd>{money.format(estimate.equipment)}</dd>
                </div>
                <div>
                  <dt>Provisional length-based delivery input</dt>
                  <dd>{money.format(estimate.delivery)}</dd>
                </div>
                <div className="rental-calculator__total">
                  <dt>Starting planning estimate</dt>
                  <dd>{money.format(estimate.total)}</dd>
                </div>
              </dl>
            </output>
          ) : (
            <p role="alert">
              Choose a supported trailer length from 20 to 40 feet.
            </p>
          )}

          <div className="rental-calculator__notice">
            <h3>What this estimate means</h3>
            <p>
              This is a nonbinding planning estimate, not a final price,
              approved rate, availability confirmation, or city-specific
              quote. The $4,995 equipment input and delivery formula remain
              subject to owner approval.
            </p>
            <p>
              Rental duration and project-specific charges are excluded.
              Availability, site access, utilities, transport conditions, and
              final scope require team confirmation. Ask the team whether any
              discounts are available for your project.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
