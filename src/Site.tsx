import { useEffect, useRef, useState } from "react";
import { Home } from "./Home";
import { DishwashingCoverageMap } from "./DishwashingCoverageMap";
import { RentalCalculator } from "./RentalCalculator";
import { SeoDashboard } from "./SeoDashboard";
import { DishwashingImageGallery } from "./DishwashingImageGallery";
import { dishwashingPhotoCollections, modelPhotoCollections } from "./dishwashingImages";
import type { SeoDashboardSection } from "./seoDashboardData";
import {
  getDishwashingModel,
  industries,
  models,
  pilotUrlMap,
  resourceContent,
  resources,
  unknownModelSpecifications,
} from "./dishwashingContent";
import {
  dishwashingRoutes,
  dishwashingSiteConfig,
  siteConfig,
} from "./dishwashingConfig";

export type SiteProps = {
  path: string;
};

const navItems = [
  ["Models", dishwashingRoutes.equipment],
  ["Calculator", dishwashingRoutes.calculator],
  ["Industries", dishwashingRoutes.industries],
  ["Service areas", dishwashingRoutes.serviceAreas],
  ["Resources", dishwashingRoutes.resources],
] as const;

const dashboardRoutes: Record<string, SeoDashboardSection> = {
  "/seo/dashboard/": "overview",
  "/seo/dashboard/diagnostics/": "diagnostics",
  "/seo/dashboard/google-status/": "google-status",
  "/seo/dashboard/authority/": "authority-metrics",
  "/seo/dashboard/portfolio/": "portfolio-readiness",
  "/seo/dashboard/protected-urls/": "protected-urls",
  "/seo/dashboard/next-checks/": "next-checks",
};

const specificationLabels: Record<string, string> = {
  exteriorDimensions: "Exterior dimensions",
  dishMachine: "Dish machine",
  racksPerHour: "Rated throughput",
  waterConnection: "Potable-water connection",
  wastewaterConnection: "Wastewater connection",
  electricalService: "Electrical service",
  fuel: "Fuel requirements",
  staffingCapacity: "Working capacity",
};

function Header({ path, openContact }: { path: string; openContact: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  return (
    <>
      <a className="dw-skip" href="#main">Skip to content</a>
      <div className="dw-urgent-bar">
        <div className="dw-shell">
          <span className="dw-urgent-signal" aria-hidden="true" />
          <strong>Time-sensitive dishwashing outage?</strong>
          <button type="button" onClick={openContact}>Prepare a callback brief</button>
          <a href={`tel:${siteConfig.phoneE164}`}>Call {siteConfig.phoneDisplay}</a>
        </div>
      </div>
      <header className="dw-header">
        <div className="dw-shell dw-header-inner">
          <a className="dw-brand" href="/" aria-label={`${siteConfig.brand} home`}>
            <img className="dw-brand-logo" src="/dishwashing-facility-logo.png" width="1263" height="1246" alt="" />
          </a>
          <nav className="dw-desktop-nav" aria-label="Primary navigation">
            {navItems.map(([label, href]) => (
              <a href={href} aria-current={path === href ? "page" : undefined} key={href}>{label}</a>
            ))}
          </nav>
          <div className="dw-header-actions">
            <button type="button" className="dw-header-contact" onClick={openContact}>
              Request availability
            </button>
            <button
              type="button"
              className="dw-menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span className="sr-only">Toggle navigation</span>
              <i /><i /><i />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="dw-mobile-nav" aria-label="Mobile navigation">
            <div className="dw-shell">
              {navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
              <a href={dishwashingRoutes.emergency}>Emergency planning</a>
              <button type="button" onClick={openContact}>Request availability</button>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const closeFromBackdrop = (event: React.MouseEvent<HTMLDialogElement>) => {
    const isBackdrop = event.target === event.currentTarget;
    const isDesktopOrTablet = window.matchMedia("(min-width: 640px)").matches;
    if (isBackdrop && isDesktopOrTablet) onClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => firstFieldRef.current?.focus());
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="dw-contact-dialog"
      aria-labelledby="contact-dialog-title"
      onClose={onClose}
      onCancel={onClose}
      onClick={closeFromBackdrop}
    >
      <div className="dw-dialog-callbar">
        <span>Time-sensitive rental need</span>
        <a href={`tel:${siteConfig.phoneE164}`}>Call {siteConfig.phoneDisplay}</a>
        <button type="button" onClick={onClose} aria-label="Close emergency call form">×</button>
      </div>
      <div className="dw-dialog-head">
        <div>
          <p className="dw-eyebrow">Emergency call notification</p>
          <h2 id="contact-dialog-title">Prepare a callback request</h2>
        </div>
      </div>
      <div className="dw-dialog-body">
        <p className="dw-emergency-disclaimer">
          For a life-safety emergency, call 911 or the appropriate local emergency service. This form is only for temporary dishwashing rental planning.
        </p>
        <p>
          Complete the brief before calling. Online callback notification stays unavailable until secure delivery and team receipt are verified.
        </p>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="dw-form-grid">
            <label>
              Name <span>Required for callback</span>
              <input ref={firstFieldRef} name="name" type="text" autoComplete="name" maxLength={100} />
            </label>
            <label>
              Callback number <span>Required for callback</span>
              <input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} />
            </label>
            <label>
              Email <span>Optional</span>
              <input name="email" type="email" autoComplete="email" maxLength={254} />
            </label>
            <label>
              Project location <span>City and state</span>
              <input name="location" type="text" autoComplete="address-level2" maxLength={160} />
            </label>
          <label>
            Dishwashing equipment
            <select name="model" defaultValue="">
              <option value="">Choose a model</option>
              {models.map((model) => <option key={model.id} value={model.id}>{model.shortName}</option>)}
              <option value="help">Help me choose</option>
            </select>
          </label>
          <label>
            What interrupted service?
            <select name="incident" defaultValue="">
              <option value="">Choose the closest reason</option>
              <option value="equipment-failure">Equipment failure</option>
              <option value="renovation">Renovation or planned shutdown</option>
              <option value="capacity">Temporary capacity gap</option>
              <option value="incident">Fire, closure or site incident</option>
              <option value="other">Other or not sure</option>
            </select>
          </label>
          <label>
            Requested start date
            <input name="startDate" type="date" />
          </label>
          <label>
            Needed response timing
            <select name="urgency" defaultValue="">
              <option value="">Choose a timeframe</option>
              <option value="immediate">As soon as availability allows</option>
              <option value="48-hours">Within 48 hours if available</option>
              <option value="week">Within one week</option>
              <option value="planned">Planned future project</option>
            </select>
          </label>
          </div>
          <label>
            Operational details
            <textarea name="message" rows={5} maxLength={3000} placeholder="What stopped, operating schedule, volume, ware types, site access, water, power and wastewater information" />
          </label>
          <div className="dw-dialog-actions">
            <button type="button" disabled aria-describedby="callback-disabled-note">Notify rental team to call</button>
            <a className="dw-dialog-call" href={`tel:${siteConfig.phoneE164}`}>Call now <strong>{siteConfig.phoneDisplay}</strong></a>
          </div>
          <p id="callback-disabled-note" className="dw-callback-status" role="status">
            Callback delivery is not connected. Your entries stay in this browser and have not been sent.
          </p>
        </form>
        {!siteConfig.phoneVerified && (
          <p className="dw-verification-note">The displayed number is provisional and still requires owner confirmation.</p>
        )}
      </div>
    </dialog>
  );
}

function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  const context = eyebrow.toLowerCase();
  const familyImage = title.startsWith("38")
    ? dishwashingPhotoCollections[3].photos[0].src
    : dishwashingPhotoCollections[0].photos[0].src;
  const card = context.includes("equipment guide")
    ? { variant: "equipment", label: "Model comparison", kicker: "Equipment decision", title: "Four footprints. One verified fit.", detail: "Compare space first, then confirm the installed machine and utilities.", steps: ["Compare", "Match", "Confirm"], image: dishwashingPhotoCollections[1].photos[0].src, mark: "" }
    : context.includes("model planning")
      ? { variant: "model", label: "Model evidence", kicker: "Specification check", title: "Verify this configuration.", detail: `${title} still requires an exact equipment and utility review.`, steps: ["Measure", "Verify", "Approve"], image: familyImage, mark: "" }
      : context.includes("contact gate")
        ? { variant: "calculator", label: "Transparent estimate", kicker: "Planning calculator", title: "Estimate before you inquire.", detail: "Choose the footprint and see the provisional inputs without sharing contact details.", steps: ["Select", "Calculate", "Review"], mark: "$", image: "" }
        : context.includes("time-sensitive")
          ? { variant: "emergency", label: "Urgent project brief", kicker: "Response planning", title: "Bring the facts. Move faster.", detail: "Lead with the outage, site, timing, volume and known utility conditions.", steps: ["Triage", "Locate", "Call"], mark: "!", image: "" }
          : context.includes("inquiry")
            ? { variant: "contact", label: "Project conversation", kicker: "Direct contact", title: "A clearer first call.", detail: "Prepare the location, dates, workflow and utility information before you connect.", steps: ["Prepare", "Call", "Confirm"], mark: "☎", image: "" }
            : context.includes("operating contexts")
              ? { variant: "industries", label: "Operational fit", kicker: "Built around service", title: "The operation sets the brief.", detail: "Meal windows, access, ware types and approvals change by industry.", steps: ["Observe", "Plan", "Fit"], image: dishwashingPhotoCollections[3].photos[0].src, mark: "" }
              : context.includes("location")
                ? { variant: "location", label: "Location intelligence", kicker: "Site-first planning", title: "Every site changes the plan.", detail: "Transport, access, weather, utilities and approvals are location-specific.", steps: ["Locate", "Check", "Route"], mark: "50", image: "" }
                : context.includes("library") || context.includes("resource")
                  ? { variant: "resource", label: "Planning knowledge", kicker: "Decision support", title: "Questions before commitments.", detail: "Use evidence-led guidance to prepare the right technical conversation.", steps: ["Read", "Question", "Verify"], mark: "§", image: "" }
                  : context.includes("privacy") || context.includes("information handling")
                    ? { variant: "privacy", label: "Information handling", kicker: "Privacy by design", title: "Clear limits. No hidden submission.", detail: "The preview explains what is and is not collected before intake is enabled.", steps: ["Explain", "Protect", "Approve"], mark: "◈", image: "" }
                    : { variant: "general", label: "Focused planning", kicker: "Commercial warewashing", title: "Start with the real project.", detail: "Define the site, workflow, utilities and schedule before confirming equipment.", steps: ["Define", "Verify", "Confirm"], mark: "DW", image: "" };

  return (
    <section className="dw-page-hero">
      <div className="dw-page-hero-glow" aria-hidden="true" />
      <div className="dw-shell">
        <nav className="dw-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">{title}</span></nav>
        <div className="dw-page-hero-grid">
          <div className="dw-page-hero-copy">
            <p className="dw-eyebrow"><i aria-hidden="true" />{eyebrow}</p>
            <h1>{title}</h1>
            <p className="dw-lede">{intro}</p>
            <div className="dw-page-hero-tags" aria-label="Planning priorities">
              <span>Site fit</span><span>Utilities</span><span>Workflow</span><span>Availability</span>
            </div>
          </div>
          <div className="dw-page-hero-card" data-variant={card.variant} aria-hidden="true">
            {card.image
              ? <img src={card.image} alt="" width="850" height="650" />
              : <div className="dw-page-hero-card-graphic"><strong>{card.mark}</strong><span>{card.label}</span></div>}
            <div className="dw-page-hero-card-shade" />
            <div className="dw-page-hero-card-top"><span>{card.label}</span><i /></div>
            <div className="dw-page-hero-card-caption">
              <small>{card.kicker}</small>
              <strong>{card.title}</strong>
              <span>{card.detail}</span>
            </div>
            <div className="dw-page-hero-card-steps">
              <span><b>01</b>{card.steps[0]}</span><i />
              <span><b>02</b>{card.steps[1]}</span><i />
              <span><b>03</b>{card.steps[2]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EquipmentOverview() {
  return (
    <>
      <PageHero
        eyebrow="Equipment guide"
        title="Commercial Dishwashing Trailer Rental"
        intro="Compare four temporary warewashing footprints, then verify the installed machine, throughput, utilities, site fit and current availability before making a rental decision."
      />
      <section className="dw-section dw-shell">
        <div className="dw-model-grid dw-model-grid-large">
          {models.map((model) => (
            <article className="dw-model-card" key={model.id}>
              <img
                className="dw-model-card-photo"
                src={modelPhotoCollections[model.id].photos[0].src}
                alt={modelPhotoCollections[model.id].photos[0].alt}
                width="1448"
                height="1086"
                loading="lazy"
              />
              <p className="dw-model-length">{model.nominalLengthFeet} FT</p>
              <h2>{model.shortName}</h2>
              <p>{model.summary}</p>
              <dl>
                <div><dt>Configuration</dt><dd>{model.configuration}</dd></div>
                <div><dt>Exact specifications</dt><dd>Pending verification</dd></div>
                <div><dt>Availability</dt><dd>Team confirmation required</dd></div>
              </dl>
              <a href={model.route}>Review model planning details <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>
      <section className="dw-section dw-section-tint">
        <div className="dw-shell">
          <div className="dw-section-heading">
            <div><p className="dw-eyebrow">Original equipment photography</p><h2>Four verified photo families from the equipment library.</h2></div>
            <p>The source sheet separates these configurations. Photos are grouped accordingly and are not used to claim that a specific unit is currently available.</p>
          </div>
          <div className="dw-source-photo-grid">
            {dishwashingPhotoCollections.map((collection) => (
              <article key={collection.id}>
                <img src={collection.photos[0].src} alt={collection.photos[0].alt} width="1448" height="1086" loading="lazy" />
                <div><p className="dw-eyebrow">{collection.photos.length} original photos</p><h3>{collection.title}</h3><p>{collection.fitNote}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ModelPage({ path, openContact }: { path: string; openContact: () => void }) {
  const model = getDishwashingModel(path)!;
  const unknown = unknownModelSpecifications(model);
  const photoCollection = modelPhotoCollections[model.id];
  return (
    <>
      <PageHero eyebrow="Model planning guide" title={`${model.name} Rental`} intro={model.summary} />
      <section className="dw-section dw-shell dw-model-detail">
        <DishwashingImageGallery collection={photoCollection} />
        <div>
          <p className="dw-eyebrow">Evidence before promises</p>
          <h2>Specifications awaiting owner verification</h2>
          <p>
            The historical page establishes this model designation, but the approved evidence does not yet establish the installed machine, throughput, exact dimensions or utility requirements.
          </p>
          <dl className="dw-spec-grid">
            {unknown.map((key) => (
              <div key={key}>
                <dt>{specificationLabels[key] || key}</dt>
                <dd>Not yet verified</dd>
              </div>
            ))}
          </dl>
          <div className="dw-actions">
            <button className="dw-button dw-button-primary" type="button" onClick={openContact}>Request availability</button>
            <a className="dw-button dw-button-quiet" href={dishwashingRoutes.calculator}>Estimate starting cost</a>
          </div>
        </div>
      </section>
      <section className="dw-section dw-section-tint">
        <div className="dw-shell">
          <div className="dw-section-heading">
            <div><p className="dw-eyebrow">Project fit</p><h2>Information needed to evaluate this model.</h2></div>
            <p>Final suitability depends on the operating workflow and site, not trailer length alone.</p>
          </div>
          <div className="dw-check-grid">
            {[
              ["Volume", "Peak meals or wares, rack mix, operating hours and surge periods."],
              ["Workflow", "Soiled receiving, scraping, pre-rinse, machine path, drying and clean storage."],
              ["Utilities", "Potable water, pressure, power, hot-water strategy and wastewater route."],
              ["Access", "Delivery path, placement area, clearances, staff movement and service access."],
            ].map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}

function CalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="No contact gate"
        title="Nationwide Temporary Dishwashing Facility Rental and Delivery Calculator"
        intro="Create a nonbinding starting estimate from provisional equipment and trailer-length delivery inputs. Location, dates, pricing and final scope still require confirmation."
      />
      <section className="dw-section dw-shell"><RentalCalculator title="Create your planning estimate" /></section>
    </>
  );
}

function EmergencyPage({ openContact }: { openContact: () => void }) {
  return (
    <>
      <PageHero
        eyebrow="Time-sensitive project planning"
        title="Emergency Commercial Dishwashing Facility Rental"
        intro="Prepare the facts needed for a fast availability conversation. This page does not promise staffing hours, equipment availability or a delivery time."
      />
      <section className="dw-section dw-shell dw-emergency-layout">
        <div>
          <h2>Call with the operational facts.</h2>
          <ol className="dw-emergency-list">
            <li><span>01</span><div><h3>Explain what stopped</h3><p>Describe the failed equipment, renovation, incident or capacity gap and the service it affects.</p></div></li>
            <li><span>02</span><div><h3>Give the location and timing</h3><p>Share the site address, requested start, expected duration, access windows and responsible site contact.</p></div></li>
            <li><span>03</span><div><h3>Describe utilities and volume</h3><p>Bring known power, potable water, wastewater, peak volume, ware types and operating schedule.</p></div></li>
          </ol>
        </div>
        <aside className="dw-emergency-call">
          <p className="dw-eyebrow">Phone path</p>
          <h2>Speak with the rental team.</h2>
          <a href={`tel:${siteConfig.phoneE164}`}>{siteConfig.phoneDisplay}</a>
          <button className="dw-button dw-button-quiet" type="button" onClick={openContact}>Prepare callback details</button>
          <p>Availability, response hours and delivery timing require confirmation during the call.</p>
          {!siteConfig.phoneVerified && <small>Provisional number observed on the current website; owner verification remains pending.</small>}
        </aside>
      </section>
    </>
  );
}

function ContactPage({ openContact }: { openContact: () => void }) {
  return (
    <>
      <PageHero
        eyebrow="General project inquiry"
        title="Request Commercial Dishwashing Rental Availability"
        intro="Prepare the equipment, location, schedule, utilities and workflow information the team needs. Online submission remains disabled until secure delivery is verified."
      />
      <section className="dw-section dw-shell dw-contact-page">
        <div>
          <h2>What to bring to the conversation.</h2>
          <div className="dw-check-grid">
            {["Project location and site contact", "Requested dates and rental duration", "Peak service volume and ware types", "Access, water, power and wastewater details"].map((item) => <article key={item}><span aria-hidden="true">✓</span><h3>{item}</h3></article>)}
          </div>
        </div>
        <aside>
          <p className="dw-eyebrow">Two honest next steps</p>
          <h2>Call now or prepare your brief.</h2>
          <a className="dw-phone-link" href={`tel:${siteConfig.phoneE164}`}>Call {siteConfig.phoneDisplay}</a>
          <button className="dw-button dw-button-primary" type="button" onClick={openContact}>Open the project worksheet</button>
          <p>Opening the worksheet does not submit information. It helps you prepare for the call.</p>
        </aside>
      </section>
    </>
  );
}

function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Operating contexts"
        title="Commercial and Institutional Dishwashing Applications"
        intro="Temporary warewashing planning starts with service windows, access, ware types, utilities and the approval path for the real facility."
      />
      <section className="dw-section dw-shell"><div className="dw-industry-grid dw-industry-grid-page">{industries.map((item) => <article key={item.title}><h2>{item.title}</h2><p>{item.body}</p></article>)}</div></section>
    </>
  );
}

function ServiceAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Location planning"
        title="Temporary Dishwashing Facility Service-Area Planning"
        intro="Location changes transport, access, utility and approval requirements. Service coverage is confirmed project by project rather than implied by a city list."
      />
      <section className="dw-section dw-shell">
        <div className="dw-service-map-heading">
          <p className="dw-eyebrow">Interactive location guide</p>
          <h2>Choose a state to begin.</h2>
          <p>The map supports location planning across all 50 states while keeping availability and delivery claims subject to direct confirmation.</p>
        </div>
        <DishwashingCoverageMap />
        <div className="dw-state-grid">
          <article><p className="dw-eyebrow">Pilot state guide</p><h2>Colorado</h2><p>Prepare site elevation, weather, access, utilities, wastewater and project timing before requesting availability.</p><a href="/states/temporary-dishwashing-facility-for-lease-in-colorado-usa/">Review Colorado planning <span aria-hidden="true">↗</span></a></article>
          <article><p className="dw-eyebrow">Protected historical URL</p><h2>Wisconsin</h2><p>The existing misspelled path remains protected while search value and coverage evidence are reviewed.</p><a href="/states/temporary-dishwashing-facility-for-lease-in-winconsin-usa/">Review Wisconsin planning <span aria-hidden="true">↗</span></a></article>
        </div>
        <div className="dw-honesty-panel"><h2>Need another state?</h2><p>Call with the project location. The absence of a state page does not prove service is unavailable, and a listed state does not guarantee equipment or delivery.</p><a href={`tel:${siteConfig.phoneE164}`}>Call {siteConfig.phoneDisplay}</a></div>
      </section>
    </>
  );
}

function ResourcesPage() {
  return (
    <>
      <PageHero eyebrow={resourceContent.eyebrow} title={resourceContent.h1} intro={resourceContent.introduction} />
      <section className="dw-section dw-shell"><div className="dw-resource-grid">{resources.map((item) => <article key={item.href}><p>PLANNING GUIDE</p><h2>{item.title}</h2><p>{item.summary}</p><small>{item.disclaimer}</small><a href={item.href}>Read guide <span aria-hidden="true">↗</span></a></article>)}</div></section>
    </>
  );
}

function ResourceArticle({ path }: { path: string }) {
  const resource = resources.find((item) => item.href === path)!;
  const sections = path.includes("backflow")
    ? [["Why this belongs in early planning", "A temporary dishwashing facility may connect to a potable-water system. The connection method, required protection and inspection path depend on the site and local authority."], ["Questions for the qualified team", "Ask who approves the connection, what device is required, who supplies and tests it, how pressure is managed, and how the assembly remains accessible."], ["What this site does not claim", "The current evidence does not verify a supplied backflow assembly, a universal device type or compliance for any specific jurisdiction."]]
    : path.includes("containment")
      ? [["Map the wastewater route", "Identify the expected flow, grease management, holding or approved discharge point, pump-out responsibility and contingency if the normal route is unavailable."], ["Keep the soil and stormwater separate", "Dishwashing wastewater may contain food residue, grease and cleaning chemistry. Do not assume open-ground or storm-drain discharge is acceptable."], ["Verify capacity and service", "Tank sizes, pump-out frequency, included equipment and environmental requirements remain project-specific and unverified."]]
      : [["Compare the complete operating system", "Include procurement, storage, hauling, waste, labor, water, energy, chemicals, equipment, setup and operational continuity."], ["Use current project inputs", "A useful comparison uses local costs, actual service volume and the length of the interruption rather than a generic savings claim."], ["Record the assumptions", "Make the decision auditable by listing every cost, duration and service-level assumption used in the comparison."]];
  return (
    <>
      <PageHero eyebrow="Planning resource" title={resource.title} intro={resource.summary} />
      <article className="dw-section dw-shell dw-article">
        <p className="dw-article-warning">General planning information only. Confirm engineering, environmental, plumbing, safety and permitting requirements with the responsible authorities and qualified professionals.</p>
        {sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
        <aside><h2>Discuss the real project.</h2><p>Bring the site, dates, volume, access and utility information to the rental conversation.</p><a href={dishwashingRoutes.contact}>Prepare your availability request</a></aside>
      </article>
    </>
  );
}

function StatePage({ state }: { state: "Colorado" | "Wisconsin" }) {
  return (
    <>
      <PageHero eyebrow="Pilot location guide" title={`${state} Commercial Dishwashing Facility Rental`} intro={`Plan a temporary warewashing project in ${state} without assuming local inventory, a fixed delivery time or a universal utility configuration.`} />
      <section className="dw-section dw-shell dw-article">
        <section><h2>Start with the project site.</h2><p>Document the precise location, access route, placement area, operating dates, service volume and the people responsible for utilities and local review.</p></section>
        <section><h2>Confirm utilities and wastewater.</h2><p>Power, potable water, pressure, hot-water strategy, grease management and wastewater routing must be matched to the selected configuration and approved locally.</p></section>
        <section><h2>Availability is not implied.</h2><p>This planning page preserves a historical state topic. It does not prove that equipment is currently located in {state} or available for a specific date.</p></section>
      </section>
    </>
  );
}

function AboutPage() {
  return <><PageHero eyebrow="Focused temporary facilities" title="About Temporary Dishwashing Facility For Lease" intro="This rebuild is designed around one clear job: helping commercial and institutional teams prepare a truthful, useful temporary warewashing request." /><section className="dw-section dw-shell dw-article"><section><h2>What the site provides</h2><p>Model-designation guides, a transparent planning calculator, utility and workflow questions, resource articles and direct contact paths.</p></section><section><h2>What remains evidence-led</h2><p>Exact specifications, availability, service coverage, staffing hours, delivery timing, manufacturer relationships and final pricing are not presented as verified until evidence supports them.</p></section></section></>;
}

function PrivacyPage() {
  return <><PageHero eyebrow="Information handling" title="Privacy Policy" intro="This preview does not accept online inquiry submissions. The policy will be finalized before a form is enabled." /><section className="dw-section dw-shell dw-article"><section><h2>Current preview behavior</h2><p>The calculator runs in the browser and does not require contact details. The contact worksheet is not submitted or stored.</p></section><section><h2>Before online intake is enabled</h2><p>The site must publish the approved purpose, lawful basis, consent language, retention period, recipients, security controls and contact method, then verify the complete delivery path.</p></section></section></>;
}

function ProtectedHistoricalPage({ path }: { path: string }) {
  const entry = pilotUrlMap.find((item) => item.path === path);
  return <><PageHero eyebrow="Protected historical URL" title={entry?.h1 || "Protected page under review"} intro="This URL remains available while its search intent, traffic, backlinks and approved content are reviewed. Unsupported claims have not been republished." /><section className="dw-section dw-shell dw-honesty-panel"><h2>Review status</h2><p>{entry?.intent}</p><p>Indexing is held for review. A redirect or expanded page will be approved only after evidence identifies the correct treatment.</p></section></>;
}

function Footer() {
  return (
    <footer className="dw-footer">
      <div className="dw-shell dw-footer-grid">
        <div><a className="dw-brand dw-brand-footer" href="/" aria-label={`${siteConfig.brand} home`}><img className="dw-brand-logo" src="/dishwashing-facility-logo.png" width="1263" height="1246" alt="" /></a><p>Commercial warewashing planning with verified claims, clear limitations and direct next steps.</p></div>
        <div><h2>Explore</h2><a href={dishwashingRoutes.equipment}>Dishwashing models</a><a href={dishwashingRoutes.calculator}>Rental calculator</a><a href={dishwashingRoutes.industries}>Industries</a><a href={dishwashingRoutes.resources}>Resources</a></div>
        <div><h2>Contact</h2><a href={dishwashingRoutes.contact}>Request availability</a><a href={dishwashingRoutes.emergency}>Time-sensitive projects</a><a href={`tel:${siteConfig.phoneE164}`}>{siteConfig.phoneDisplay}</a></div>
      </div>
      <div className="dw-shell dw-footer-bottom"><span>© 2026 {siteConfig.brand}</span><a href={dishwashingRoutes.privacy}>Privacy</a></div>
    </footer>
  );
}

function EmergencySupportDock({ openContact }: { openContact: () => void }) {
  const [open, setOpen] = useState(false);

  const prepareCallback = () => {
    setOpen(false);
    openContact();
  };

  return (
    <aside className={`dw-support-dock${open ? " is-open" : ""}`} aria-label="Emergency rental support">
      <div id="emergency-support-panel" className="dw-support-panel" hidden={!open}>
        <div className="dw-support-panel-head">
          <div>
            <p className="dw-support-kicker">Urgent dishwashing support</p>
            <h2>Need equipment urgently?</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close urgent support options">×</button>
        </div>
        <p>Call our rental line now or prepare your site details for a return call.</p>
        <div className="dw-support-actions">
          <a className="dw-support-call" href={`tel:${siteConfig.phoneE164}`}>
            <span>Call now</span>
            <strong>{siteConfig.phoneDisplay}</strong>
            <span aria-hidden="true">↗</span>
          </a>
          <button type="button" onClick={prepareCallback}>Prepare callback details</button>
        </div>
        <small>Final availability, response time and arrival timing require team confirmation.</small>
      </div>
      <button
        className="dw-support-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="emergency-support-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="dw-support-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img"><path d="M7.3 3.7 9.6 8l-1.8 1.7a14.1 14.1 0 0 0 6.5 6.5l1.7-1.8 4.3 2.3-1 3.2c-.2.7-.9 1.1-1.6 1.1C9.6 20.5 3.5 14.4 3 6.3c0-.7.4-1.4 1.1-1.6l3.2-1Z" /></svg>
        </span>
        <span className="dw-support-trigger-copy"><small><i aria-hidden="true" /> 24/7 call line</small><strong>Call now</strong></span>
        <span className="dw-support-trigger-mark" aria-hidden="true">{open ? "×" : "→"}</span>
      </button>
    </aside>
  );
}

function StickyContactButton({ openContact }: { openContact: () => void }) {
  return (
    <button className="dw-contact-sticky" type="button" onClick={openContact} aria-haspopup="dialog">
      <span className="dw-contact-sticky-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 5.5h14v10H9.5L5 19v-3.5Z" /><path d="M8.5 9h7M8.5 12h4.5" /></svg>
      </span>
      <span><small>Planning questions?</small><strong>Contact us</strong></span>
      <span className="dw-contact-sticky-arrow" aria-hidden="true">↗</span>
    </button>
  );
}

export function Site({ path }: SiteProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const model = getDishwashingModel(path);
  const resource = resources.find((item) => item.href === path);
  const openContact = () => setContactOpen(true);
  const protectedHistorical = ["/testimonials/", "/brand-comparison/", "/cafeteria-kitchen-dishwasher-facility/"].includes(path);
  const dashboardSection = dashboardRoutes[path];

  if (dashboardSection) {
    return <SeoDashboard section={dashboardSection} />;
  }

  let page: React.ReactNode;
  if (path === "/") page = <Home openContact={openContact} />;
  else if (path === dishwashingRoutes.equipment) page = <EquipmentOverview />;
  else if (model) page = <ModelPage path={path} openContact={openContact} />;
  else if (path === dishwashingRoutes.calculator) page = <CalculatorPage />;
  else if (path === dishwashingRoutes.emergency) page = <EmergencyPage openContact={openContact} />;
  else if (path === dishwashingRoutes.contact) page = <ContactPage openContact={openContact} />;
  else if (path === dishwashingRoutes.industries) page = <IndustriesPage />;
  else if (path === dishwashingRoutes.serviceAreas) page = <ServiceAreasPage />;
  else if (path === dishwashingRoutes.resources) page = <ResourcesPage />;
  else if (resource) page = <ResourceArticle path={path} />;
  else if (path.includes("colorado-usa")) page = <StatePage state="Colorado" />;
  else if (path.includes("winconsin-usa")) page = <StatePage state="Wisconsin" />;
  else if (path === dishwashingRoutes.about) page = <AboutPage />;
  else if (path === dishwashingRoutes.privacy) page = <PrivacyPage />;
  else if (protectedHistorical) page = <ProtectedHistoricalPage path={path} />;
  else page = <><PageHero eyebrow="Page not found" title="We could not find that page" intro="Use the model guide, calculator or contact route to continue planning." /><section className="dw-section dw-shell"><a className="dw-button dw-button-primary" href={dishwashingRoutes.equipment}>Browse dishwashing models</a></section></>;

  return (
    <>
      <Header path={path} openContact={openContact} />
      <main id="main">{page}</main>
      <Footer />
      <StickyContactButton openContact={openContact} />
      <EmergencySupportDock openContact={openContact} />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

export const privateRoute = dishwashingRoutes.seoAdmin;
export const dashboardNoindex = true;
export const evidenceConfig = dishwashingSiteConfig;
