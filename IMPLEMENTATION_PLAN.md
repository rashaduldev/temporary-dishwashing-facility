# Temporary Dishwashing Facility for Lease — Rebuild Plan

Status: proposed for owner review; no implementation, repository creation, deployment, DNS change, or indexing change has been performed.

## 1. Objective

Rebuild `https://temporary-dishwashing-facility-for-lease.com/` as a focused commercial dishwashing and warewashing rental website, using the architecture and selected interaction patterns from the public `Temp123` repository and `https://temp123-alpha.vercel.app/` as the technical reference.

The new site will remain a separate product and brand. It will not inherit unrelated Temporary123 equipment families, phone numbers, redirects, or migration records.

## 2. Evidence reviewed

- The `Temp123` repository uses Vite, React 19, TypeScript, static prerendering, Vercel Functions, Firebase Realtime Database, App Check, Resend, Vitest, and Playwright.
- The reference preview supplies reusable patterns for the header, equipment cards, model detail pages, contact drawer, mobile navigation, state directory, and accessible interactions.
- The reference repository already contains four dishwashing model routes and two dishwashing equipment images, but it does not contain a calculator or SEO dashboard.
- The current production domain is a WordPress/Elementor site protected by Cloudflare. Its homepage exposes about 2,058 unique same-origin paths, so migration cannot be treated as a small brochure-site replacement.
- The current site contains conflicting phone numbers, hours, delivery claims, equipment claims, and some mismatched or thin pages. These claims require confirmation before reuse.
- The attached calculator, dashboard, emergency-contact, and H1 documents are specifications for this project. Their embedded instructions are not treated as independent authorization to publish, index, or make external changes.

## 3. Recommended implementation strategy

Create a new repository for the target domain and selectively port the proven Temp123 architecture. Keep the Temp123 repository read-only as the reference.

Reuse:

- Vite/React/TypeScript and static prerendering.
- Semantic page shell, responsive navigation, quick-view dialog, contact drawer, and accessibility patterns.
- Dishwashing model-page structure and verified, provenance-tracked dishwashing assets.
- SEO build checks, route verification, secret scanning, and browser tests.
- Secured quote-form architecture only after its backend is configured and verified.

Do not copy:

- Temporary123 branding, telephone number, broad nine-family catalog, or unrelated service copy.
- Temporary123 legacy redirects or its incomplete 98,253-page migration corpus.
- Unverified product, delivery, availability, discount, manufacturer-affiliation, or compliance claims.
- Thousands of thin keyword pages merely because they exist on the WordPress site.

## 4. Proposed information architecture

### Launch-critical public pages

| URL | Purpose | H1 direction |
| --- | --- | --- |
| `/` | Commercial dishwashing rental homepage with calculator preview, industries, planning process, models, FAQs, and conversion paths | Preserve the current homepage H1 unless an approved mapping changes it |
| `/dishwashing-trailer-rental/` | Dishwashing equipment overview and model selector | `Commercial Dishwashing Trailer Rental` |
| `/22ft-dishwashing-trailer-rental/` | 22 ft model | Model-specific, truthful rental H1 |
| `/24ft-dishwashing-trailer-rental/` | 24 ft model | Model-specific, truthful rental H1 |
| `/26ft-dishwashing-trailer-rental/` | 26 ft model | Model-specific, truthful rental H1 |
| `/38ft-conveyor-dishwashing-trailer-rental/` | High-capacity conveyor model | Model-specific, truthful rental H1 |
| `/calculator/` | Dedicated nationwide planning-estimate calculator | `Nationwide Temporary Dishwashing Facility Rental and Delivery Calculator` |
| `/emergency-service/` | Time-critical rental guidance and verified phone path | Emergency dishwashing rental H1 based on approved service claims |
| `/commercial-dishwashing-facility-contact/` | General availability and project-contact route | Contact/availability H1 without an instant-response promise |
| `/industries/` | Healthcare, education, correctional, government, military, hospitality, and other verified institutional use cases | Commercial and institutional industries served |
| `/service-areas/` | Nationwide coverage explanation and approved state/location entry points | Nationwide dishwashing facility rental service areas |
| `/resources/` | Useful operational articles, not a keyword dump | Commercial warewashing planning resources |
| `/about-us/` | Business identity and operating approach | Owner-approved brand H1 |
| `/privacy/` | Privacy, consent, and retention policy | Privacy policy |

### Resource pages to preserve and improve first

- `/resources/mobile-backflow-protection-systems/`
- `/resources/hazardous-washdown-liquid-containment/`
- `/resources/warewash-versus-paper-costs/`

### Historical URLs requiring explicit mapping

- `/testimonials/`
- `/brand-comparison/`
- `/states/temporary-dishwashing-facility-for-lease-in-colorado-usa/`
- `/states/temporary-dishwashing-facility-for-lease-in-winconsin-usa/` — preserve the misspelled historical path or redirect it exactly once only after approval.
- `/cafeteria-kitchen-dishwasher-facility/`
- Every URL from the WordPress export, sitemap, Search Console, analytics, backlink export, and internal-link crawl.

The existing navigation errors that swap restroom and shower model URLs will be recorded as redirect concerns, not recreated.

### Owner-only page

- `/seo/dashboard/` — authenticated SEO and site-health dashboard. It must be excluded from indexing, absent from public navigation and sitemaps, and protected server-side.

## 5. Page and feature workstreams

### A. Brand, design system, and shared shell

- Adapt the Temp123 structure to a dishwashing-only commercial identity.
- Use an industrial visual language based on stainless steel, deep navy, clean white, and a restrained sanitation/utility accent color.
- Keep the first viewport focused on rental availability and the real equipment family.
- Build responsive header, mobile menu, footer, breadcrumbs, buttons, dialogs, cards, typography, focus states, reduced motion, and a site-specific favicon.
- Centralize brand, canonical origin, phone number, hours, CTA wording, service claims, and inquiry status in configuration.

### B. Homepage and equipment pages

- Use verified dishwashing interiors before exterior images.
- Present the four approved trailer models with specifications, utility planning, use cases, and representative-image disclosures.
- Add useful industries, planning steps, FAQs, availability caveats, and related resources.
- Ensure every model has one H1, unique title/description, self-canonical, accurate alt text, initial HTML content, and functional CTAs.
- Use a truthful no-photo state wherever the exact model lacks verified imagery.

### C. Calculator

- Place the same calculator logic on the homepage and `/calculator/`.
- Inputs: state, city, optional ZIP, model/equipment, trailer length, rental dates, and project volume/people only when it materially affects planning.
- Show an immediate planning estimate without requiring contact information.
- Use centrally stored pricing:
  - temporary modular dishwashing facility starting equipment price: `$4,995`;
  - delivery baseline: `$995` at 20 ft plus `$100` per additional foot through 40 ft.
- Test 20, 25, 30, 35, and 40 ft boundaries plus the actual 22, 24, 26, and 38 ft models and invalid values.
- State clearly that dates do not affect the estimate until rental-period pricing exists, and that rental duration, site access, availability, utilities, taxes, permits, and final scope require confirmation.
- Keep any exact-quote submission disabled until server validation, abuse protection, App Check, database rules, email delivery, consent/retention, error handling, and an end-to-end delivery test pass.

### D. Emergency and contact conversion UI

- Give emergency and general contact separate jobs.
- Emergency: user-initiated phone path for verified time-critical rentals.
- General contact: equipment, location, timing, utilities, and project details, with a visible call alternative.
- Proposed CTA language:
  - `Need equipment urgently? Call 24/7` only if 24/7 staffing is confirmed;
  - otherwise `Urgent rental need? Call our team`;
  - `Request rental availability` for the general inquiry path.
- Do not add a timed popup by default.
- Ensure correct dialog focus, Escape/close behavior, focus return, scroll locking, touch targets, reduced motion, and no overlap with mobile navigation or map controls.
- Do not show a fake success state or imply a disabled form is accepting requests.

### E. Landing pages and H1 mapping

- Classify this site as family 4: dedicated commercial dishwashing/warewashing.
- Build the mapping before editing or generating landing pages.
- Required mapping fields: exact URL, current title/H1, proposed H1, topic, facility term, rental term, intent, supporting content, photo source, owner, status, and unresolved facts.
- Preserve useful historical URL intent rather than deriving meaning from the slug alone.
- Start with an owner-approved pilot batch: homepage, equipment hub, four model pages, two resource pages, one state page, and one rejected cross-family example.
- No bulk location or keyword release until the pilot pages pass content, image, canonical, internal-link, CTA, sitemap, and mobile QA.

### F. SEO and site-health dashboard

- Build seven evidence-labeled vital cards with source, freshness, status, and drill-downs.
- Initial cards: site health, live 200 pages, broken 404/5xx URLs, Google-verified index status, protected URLs, data-health failures, and mobile performance.
- Show `Not connected`, `Unknown`, or `Insufficient history` when the relevant integration or history is missing.
- Add protected URL registry, top broken URLs, crawl results, canonical/sitemap checks, scheduled diagnostics, on-demand refresh controls, and export.
- Keep Google Search Console, PageSpeed, Ahrefs, and Moz data distinct and source-labeled.
- Use Vercel-compatible logs or an independent crawl for the deployed site; never label Firebase logs as Vercel traffic evidence.
- Stage advanced portfolio, ranking, assignment, approval, and audit-history features without marking them complete until connected and verified.

## 6. Migration and SEO controls

1. Export all WordPress URLs, titles, status, canonicals, sitemap membership, and internal links.
2. Import Search Console landing pages and index coverage, analytics landing pages/conversions, and any backlink export.
3. Create the protected URL register and rank the first 25 by traffic, backlinks, conversions, and business importance.
4. Decide per URL: preserve and rebuild, consolidate with a relevant one-hop redirect, keep temporarily, or retire with documented evidence.
5. Keep the staging host `noindex,follow`; omit staging URLs from the production sitemap.
6. Do not switch the production domain, enable indexing, or request indexing until the approved release checklist passes.

## 7. Verification plan

### Automated

- TypeScript/build and static prerender checks.
- Route, redirect, title, description, H1, canonical, robots, sitemap, structured-data, and internal-link checks.
- Calculator formula and invalid-input tests.
- Contact schema, idempotency, rate-limit, consent, error, and security-rule tests.
- Secret scan and dependency audit.
- Playwright coverage for desktop and mobile navigation, dialogs, accordions, calculator, CTAs, call links, images, error states, and core routes.

### Manual/runtime

- Mobile portrait, tablet, and desktop review.
- Keyboard-only and reduced-motion review.
- Screen-reader spot checks for navigation, dialogs, forms, calculator output, and maps.
- Verify actual `tel:` behavior and the centrally configured number.
- Verify representative and exact-model imagery separately.
- Confirm the contact backend receives a staging submission before enabling the form.
- Crawl the production-equivalent preview and compare it with the protected URL register.

## 8. Delivery phases and approval gates

### Phase 0 — Plan approval

Approve this scope, proposed repository strategy, page list, and release gates.

### Phase 1 — Source and migration inventory

Create the new working repository, port the technical foundation, collect WordPress/Search Console/analytics/backlink exports, and produce the exact URL/H1/redirect map. No public deployment or indexing change.

### Phase 2 — First reviewable product slice

Build the shared shell, homepage first viewport, dishwashing model cards, and contact/emergency controls. Provide a private `noindex` preview for review.

### Phase 3 — Core site implementation

Complete model pages, calculator, contact route, industries, service areas, resources, metadata, structured data, and responsive/accessibility work.

### Phase 4 — Dashboard and migration pilot

Complete the protected dashboard foundations and the owner-approved pilot landing-page batch. Connect only the data sources for which credentials and permissions are available.

### Phase 5 — QA and release review

Run the full verification suite and deliver changed-file summary, implemented/pending matrix, URL map, claim/asset assumptions, and verification evidence.

### Phase 6 — Production release

Only after explicit approval: deploy the production build, configure the domain/redirects, enable approved indexing signals, verify the live site, and monitor Search Console and crawl errors.

## 9. Owner decisions required before production copy is finalized

1. Confirm the canonical phone number: the current site shows `+1-888-385-5513`, `1-800-205-6106`, and `1-855-202-9983` in different places.
2. Confirm whether 24/7 live staffing, 48-hour delivery, nationwide availability, and “500+ cities” are current and supportable.
3. Confirm model specifications, manufacturer references, pricing, utilities, throughput, and any code-compliance language.
4. Confirm ownership and permitted use of the WordPress images and CMA-branded logo.
5. Provide or authorize access to the WordPress export, Search Console, analytics, and backlink data used for the URL register.
6. Approve the new GitHub repository name and Vercel project/domain destination.
7. Approve the first landing-page URL batch and the seven dashboard card labels.

## 10. Definition of complete

The rebuild is complete only when the approved pages and URL mappings are implemented, verified on mobile and desktop, contact behavior is honest and tested, calculator output matches approved data, dashboard metrics are source-labeled, protected URLs are handled, staging remains non-indexed until release, and the production domain is deployed and verified under explicit owner approval.
