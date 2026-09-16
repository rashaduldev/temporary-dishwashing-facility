import { useEffect, useRef, useState } from "react";
import site from "../site.json" with { type: "json" };
import { services } from "./content";
import { leadSchema } from "../server/schema";
let check: import("firebase/app-check").AppCheck | undefined;
async function appCheckToken() {
  if (!import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY)
    throw new Error(
      "Online inquiries are not enabled yet. Your details have not been sent.",
    );
  const [
    { initializeApp, getApps },
    { initializeAppCheck, ReCaptchaEnterpriseProvider, getToken },
  ] = await Promise.all([import("firebase/app"), import("firebase/app-check")]);
  const app =
    getApps()[0] ||
    initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });
  check ||= initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(
      import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY,
    ),
    isTokenAutoRefreshEnabled: false,
  });
  try {
    return (await getToken(check)).token;
  } catch {
    throw new Error(
      "We could not verify the form. Please check your connection and try again.",
    );
  }
}
export function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const form = formRef.current;
    const location =
      form?.closest<HTMLElement>("#quote-island")?.dataset.selectedLocation;
    const field = form?.querySelector<HTMLInputElement>(
      'input[name="location"]',
    );
    if (field && location) field.value = location;
  }, []);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const key = useRef(""),
    last = useRef(""),
    busy = useRef(false);
  const error = (name: string) =>
    errors[name] ? (
      <span id={`${name}-error`} className="field-error">
        {errors[name]}
      </span>
    ) : null;
  const attrs = (name: string) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="field-label">
      <span>{children}</span>
      <small>Required</small>
    </span>
  );
  return (
    <form
      ref={formRef}
      className="quote-form"
      noValidate
      aria-busy={state === "loading"}
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy.current) return;
        const form = e.currentTarget;
        const values = Object.fromEntries(new FormData(form));
        const parsed = leadSchema.safeParse({
          ...values,
          consent: values.consent === "on",
        });
        if (!parsed.success) {
          const fields: Record<string, string> = {};
          for (const issue of parsed.error.issues) {
            const field = String(issue.path[0]);
            fields[field] ??=
              field === "consent"
                ? "Please agree to the use of your details to receive a response."
                : field === "service"
                  ? "Choose a service."
                  : field === "duration"
                    ? "Choose a rental duration."
                    : field === "industry"
                      ? "Choose an industry."
                      : issue.message;
          }
          setErrors(fields);
          setState("error");
          setMessage("Check the highlighted fields before sending.");
          const first = form.elements.namedItem(Object.keys(fields)[0]);
          if (first instanceof HTMLElement) first.focus();
          return;
        }
        setErrors({});
        const payload = JSON.stringify(parsed.data);
        if (payload !== last.current) {
          key.current = crypto.randomUUID();
          last.current = payload;
        }
        busy.current = true;
        setState("loading");
        setMessage("");
        try {
          const token = await appCheckToken();
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Firebase-AppCheck": token,
              "Idempotency-Key": key.current,
            },
            body: payload,
            signal: AbortSignal.timeout(20000),
          });
          const result = await res.json().catch(() => null);
          if (!res.ok) {
            if (res.status === 429)
              throw new Error(
                "Too many attempts. Please wait a few minutes before trying again.",
              );
            throw new Error(
              typeof result?.error === "string"
                ? result.error
                : "We could not save your inquiry. Please try again.",
            );
          }
          if (result?.ok !== true)
            throw new Error(
              "We could not confirm your inquiry. Please retry with the same details.",
            );
          setState("success");
          setMessage(
            "Your inquiry has been saved. Thank you for sharing your project details.",
          );
          form.reset();
          key.current = "";
          last.current = "";
        } catch (err) {
          setState("error");
          setMessage(
            err instanceof Error &&
              ["TimeoutError", "AbortError", "TypeError"].includes(err.name)
              ? "The connection was interrupted. Your details are still here; try sending again."
              : err instanceof Error
                ? err.message
                : "We could not save your inquiry. Please try again.",
          );
        } finally {
          busy.current = false;
        }
      }}
    >
      {!site.inquiriesEnabled && (
        <p className="form-intro">
          Online submission is being prepared. Complete the project brief, or
          call <a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a> for
          immediate assistance.
        </p>
      )}
      <fieldset disabled={state === "loading"}>
        <legend className="sr-only">Project inquiry</legend>
        <div className="form-grid">
          <label>
            <FieldLabel>Name</FieldLabel>
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              {...attrs("name")}
            />
            {error("name")}
          </label>
          <label>
            <FieldLabel>Phone</FieldLabel>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={30}
              {...attrs("phone")}
            />
            {error("phone")}
          </label>
          <label>
            <FieldLabel>Email</FieldLabel>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              {...attrs("email")}
            />
            {error("email")}
          </label>
          <label>
            <FieldLabel>Rental date</FieldLabel>
            <input
              name="startDate"
              type="date"
              required
              {...attrs("startDate")}
            />
            {error("startDate")}
          </label>
          <label>
            <FieldLabel>Project location</FieldLabel>
            <input
              name="location"
              autoComplete="address-level2"
              required
              maxLength={160}
              placeholder="City and state"
              {...attrs("location")}
            />
            {error("location")}
          </label>
        </div>
        <label>
          <FieldLabel>What facilities do you need?</FieldLabel>
          <select name="service" required defaultValue="" {...attrs("service")}>
            <option value="" disabled>
              Select a service
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
            <option value="multiple">Several facilities / help deciding</option>
          </select>
          {error("service")}
        </label>
        <label>
          <FieldLabel>Rental duration</FieldLabel>
          <select
            name="duration"
            required
            defaultValue=""
            {...attrs("duration")}
          >
            <option value="" disabled>
              Choose a rental duration
            </option>
            <option value="under-1-month">Less than one month</option>
            <option value="1-3-months">One to three months</option>
            <option value="3-6-months">Three to six months</option>
            <option value="6-plus-months">Six months or longer</option>
            <option value="not-sure">Not sure yet</option>
          </select>
          {error("duration")}
        </label>
        <label>
          <FieldLabel>Select your industry</FieldLabel>
          <select
            name="industry"
            required
            defaultValue=""
            {...attrs("industry")}
          >
            <option value="" disabled>
              Choose an industry
            </option>
            <option value="construction">Construction and workforce</option>
            <option value="government">Government and public services</option>
            <option value="food-service">Food service and hospitality</option>
            <option value="emergency-response">
              Emergency and disaster response
            </option>
            <option value="other">Other</option>
          </select>
          {error("industry")}
        </label>
        <label>
          <FieldLabel>Project details</FieldLabel>
          <textarea
            name="message"
            rows={4}
            minLength={20}
            maxLength={3000}
            required
            placeholder="Dates, expected occupancy and known site requirements"
            {...attrs("message")}
          />
          {error("message")}
        </label>
        <div className="honeypot" aria-hidden="true">
          <label>
            Company website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <input type="hidden" name="page" value="/contact/" />
        <label className="consent">
          <input
            type="checkbox"
            name="consent"
            required
            {...attrs("consent")}
          />
          <span>
            I agree that {site.brand} may use these details to respond to my
            inquiry. <a href="/privacy/">Read the Privacy Notice.</a>
            {error("consent")}
          </span>
        </label>
        <button
          className="button"
          type="submit"
          disabled={!site.inquiriesEnabled || state === "loading"}
        >
          {state === "loading" ? "Saving inquiry…" : "Send project inquiry"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </fieldset>
      <p
        role={state === "error" ? "alert" : "status"}
        aria-live="polite"
        className={`form-status ${state}`}
      >
        {message}
      </p>
    </form>
  );
}
