# April rebuild: evidence and implementation plan

Audit date: 2026-09-11 UTC. Source: the attached workbook, read without modification. Reproduce with `python scripts/audit.py PATH_TO_WORKBOOK` (requires openpyxl). See `summary.json` for the source hash, dates and counts.

## Decision

Prepare an isolated, nonindexable April implementation and preserve the existing website. Do not activate a migration from this evidence alone. The user's latest instruction authorizes improving the plan and delivering ZIP files. This revised plan permits offline engineering after the spreadsheet audit, while moving business-fact and migration approval to the release gate. It does not represent the audit or any URL decision as owner-approved. Draft service content is for review, not production publication. No phone number is borrowed from Temporary123.

## Recalculated data quality

| Observation | Result |
|---|---:|
| Sheets | 1: temporary123.com-bbl-external-s |
| Data rows / columns | 148 / 16 |
| Exact unique URLs | 148 |
| Strategic groups after https + apex + trailing-slash normalization | 102 |
| Groups with www removed but protocol retained | 103 |
| HTTPS / HTTP rows | 146 / 2 |
| Apex / www rows | 52 / 96 |
| Export HTTP 200 / 301 / 403 / missing | 21 / 67 / 30 / 30 |
| Missing title / language / platform | 127 each |
| Missing UR | 30 |
| Follow + nofollow totals differing from total links | 4 |
| Priority A / B / C / D / E | 3 / 5 / 121 / 0 / 19 |

The prompt's 146 normalized-target estimate is not reproduced. Here 146 is the number of HTTPS rows. Strategic normalization is an analytical grouping, not proof that variants serve the same content. Paths retain case and meaningful queries; assets retain file extensions. No exact duplicate URL rows exist. Blank status is unknown, never zero or 200. The `Redirects` metric is not a measured redirect chain and is not used as one.

First-seen timestamps span 2023-05-16 through 2026-08-29. Last-seen timestamps span 2026-04-09 through 2026-09-10. Source timezone and the new/lost-link reporting window are not supplied. Counts across variants are not summed as unique referring domains: source identities may overlap.

## Field mapping and inventory

`field-mapping.csv` lists all 16 source fields, meanings, missing counts, reliability and the absent backlink-level fields. `url-inventory.csv` gives every row a stable ID, original and normalized URL, service/location inference, exported metrics, flags, classification, action and missing evidence. Location labels are slug inferences, not verified business coverage. `high-value-candidates.csv` includes A/B rows and supplementary DR/domain-count candidates. `manual-review.csv` contains unresolved and quality-review rows. `migration-map.csv` covers all 148 source rows; destinations and codes remain empty until evidence and owner approval exist.

## Priority rules and equity candidates

A/B protect known high-value target candidates first. B denotes a nonpreferred protocol/host variant, with a proposed equivalent-path treatment only after live equivalence is checked. C identifies repeated metrics, disproportionate links, reconciliation issues or uncertain quality. E marks missing content/status evidence without stronger pattern flags. D is unused because no evidence justifies retirement. Priority is a triage decision, not a Google metric or toxicity score.

| Target group | Evidence from separate rows | Proposed treatment |
|---|---|---|
| Homepage | Apex HTTPS: 541 referring domains, Top DR 91; www HTTPS: 292 domains | Protect root; verify rebrand/domain ownership and direct host normalization |
| Houston kitchen | Apex: 8 domains, DR 74; www: 7 domains, DR 74 | Preserve exact path; no move to generic kitchen hub |
| California restroom | Apex: 5 domains, DR 74; www: 6 domains, DR 74 | Preserve exact nested path; confirm location-specific equivalence |
| Temporary workforce housing | Apex: 5,301 links from 4 domains; www: 23,073 links from 4 domains | Manual review; source links and meaningful content required |

Nofollow links can carry referral and brand value. Do not discard them. DR/UR are provider metrics, not a Google quality determination. Do not disavow or request backlink changes based on this file.

## Risk register

| Priority | Pattern / affected scope | Evidence | Required action / acceptance |
|---|---|---|---|
| P0 | Migration of 148 backlink targets | No approved production origin or equivalent replacements | SEO + owner approve every map row before switch; no orphaned priority destination |
| P1 | 60 missing/403 export statuses | Historical snapshot only | Fresh crawl and URL Inspection samples; distinguish bot block from Google access |
| P1 | Workforce concentration | Thousands of links from 1–4 domains | Referring-page inspection, placements, relevance, traffic; retain until decision |
| P1 | Repeated state metrics | 51 rows share 2 domains, DR 10, 13 links | Compare unique main content with place names masked; repeated link metrics alone prove no content duplication |
| P1 | Four metric inconsistencies | Follow + nofollow totals exceed reported total | Re-export, verify scope/date and provider metric definitions |
| P1 | Unverified April identity/coverage | No approved phone, domain or fleet facts | Central verified configuration and release checks |
| P2 | Asset destination | PNG under /wp-content/uploads/ | Confirm rights, original bytes and equivalent asset; never redirect to a marketing homepage |
| P2 | Large reference navigation | Public root rendering includes broad menus and extensive locality links | Use concise service hubs and contextual links; full crawl still required |

## Public-site reconnaissance and coverage limit

The public homepage was accessible through web retrieval on 2026-09-11. Its retrieved body included a news/blog empty state and very extensive location navigation. This is a public retrieval observation, not proof of browser rendering, current HTTP status or indexing. Direct terminal access timed out; robots.txt and sitemap_index.xml web retrieval returned tool errors. Do not interpret retrieval errors as site HTTP errors. No authenticated Search Console, CMS export, logs or analytics were available. The spreadsheet is a backlink-target export, not the whole website inventory. A complete live crawl and content comparison remain open.

Reference: https://temporary123.com/ . A sampled page fetch log is supplied separately. No reference copy, images, claims or telephone number are adopted as April business facts.

## Architecture and page-type plan

| Page family | Proposed route convention | Release condition |
|---|---|---|
| Home | / | Verified April identity and approved positioning |
| Service hub | /services/ | Actual service catalogue approved |
| Service detail | /services/{service}/ | Distinct practical intent and approved service capability |
| Project sectors | /industries/ | Use-case guidance without invented customer logos/contracts |
| Service area hub | /service-areas/ | Confirmed coverage only |
| Valuable existing local pages | Existing exact path | Location facts, owner coverage approval, migration review |
| New local pages | /service-areas/{state}/{city}/{service}/ | New intent and evidence; no duplicate city substitutions |
| Planning guide | /planning/ | Useful planning questions, no permit or delivery guarantees |
| Inquiry | /contact/ | Approved privacy notice, configured storage and verified email routing |
| Privacy | /privacy/ | Business-specific review of purpose, retention, contact and processors |

Initial software implements home, hubs, four differentiated service drafts, a sector page, planning, inquiry and privacy review text. Unverified location pages are not generated. An expansion inventory retains all 102 normalized paths for editorial decisions. Core topics include mobile kitchens, restrooms/showers, workforce housing and temporary facilities; equipment and institutional subpages are expansion candidates, not empty generated pages.

## Local SEO plan

Begin with Houston kitchen and the relevant California restroom region because the workbook identifies them as equity candidates. This is a research order, not a service-area claim. Owner selects real primary markets, then confirms 5–7 geographically relevant nearby cities for each. Check current Census/municipal populations and estimate years, preferring under 100,000 where appropriate. Record logistics, unique customer questions, actual equipment availability and evidence sources. Do not pick an arbitrary California city or invent coverage. Keep draft if fewer than five can be verified. Link only to useful published destinations; otherwise use readable city names. No population or local-service claim is presently verified.

## Redirect and canonical strategy

Retain valuable paths by default. Final origin is configurable, never temporary123.com by assumption. Origin/host normalization must go directly to the final path, with a tested permanent redirect. Implement only individually approved, content-equivalent mappings. Exclude assets from HTML normalization. Keep query semantics. Do not turn every unresolved URL into a homepage redirect. Never use `noindex` as a canonicalization mechanism. Unresolved rows block migration, not the old site. Keep the source site operating until replacement coverage is reconciled.

Draft builds contain no production canonicals and an empty sitemap, with noindex. Approved release builds produce route-specific static HTML, self canonicals and sitemap entries from approved content. Unknown paths return 404. Redirect activation is intentionally separate from draft builds.

## Missing-data request and approval checklist

- [ ] April's approved display phone + international tel value, final domain, legal identity and contact
- [ ] Confirm whether April owns Temporary123 and whether this is a same-domain rebuild or cross-domain move
- [ ] Actual offered services, coverage, addresses (if any), equipment facts and owned images
- [ ] Backlink-level export: source page/domain, target, anchor, attributes, placement, dates and context
- [ ] Search Console page/query/indexing exports and representative URL Inspection
- [ ] Complete sitemap/CMS URL export, traffic, leads and server/CDN error logs
- [ ] Every migration row: equivalent destination, reason, owner and approval
- [ ] Resend sender domain verified, destination inbox approved, production Firebase project and Vercel project
- [ ] Privacy retention/contact approved; staging integration and rules tests completed

## Improved implementation sequence

1. Complete read-only spreadsheet analysis and source-level limitation statement (this package).
2. Build isolated draft UI and secure integration code; no production content approval implied.
3. Reconcile full intended URL inventory from crawl, CMS, sitemap, Search Console and workbook.
4. Verify identity and service facts, revise copy, resolve A/B destinations first, then C/E records.
5. Compare original/rewritten main content and intent, approve only useful local pages.
6. Configure separate preview/production Firebase and Vercel environments, verify Resend email path and abuse limits.
7. Run release gates: source HTML, route status, sitemap/canonical alignment, one-hop redirects, rules, forms, mobile and accessibility.
8. Approve migration, deploy rules and application in coordinated order, retain rollback and monitoring baseline.
9. Check priority URLs immediately and at +1, +7, +14 and +30 days: errors, crawl/indexation, queries, leads and lost links. No indexation guarantee.

## Research basis

Google migration guidance: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes . Use URL mapping, direct relevant redirects and monitoring; the absence of source control/ownership prevents backlink migration implementation here. Firebase rules testing: https://firebase.google.com/docs/firestore/security/test-rules-emulator . Resend idempotency: https://resend.com/docs/dashboard/emails/idempotency-keys . Provider keys deduplicate for 24 hours; application records must bound retries beyond that window.
