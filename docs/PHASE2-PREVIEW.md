# Phase 2 preview implementation

Approved September 12, 2026. Final public origin: https://temporary123.com.
Branch: `seo/phase2-preview`. Production launch has not been approved.

Implemented:

- Keep every draft HTML page noindex. Add a hostname-conditioned X-Robots-Tag to all non-public-host responses, including assets, independent of Vercel's Production environment label. Preserve the existing authentication protection on deployment aliases.
- Keep source archives intact. Remove only named repeated city/state navigation sections from rendered imported content; retain following business sections. Preserve unresolved valuable links and track them explicitly.
- Restore 186 archived images to their exact original upload paths at build time, with byte counts and SHA-256 evidence. Do not manufacture unavailable originals from thumbnails. Use recovered image targets for image-only links when their original enlargement is missing. Add dimensions for recovered PNGs and normalize heading order in imported content.
- Expose government/GSA information in the footer and restore the two observed external procurement-PDF links without adding claims or changing the PDFs.
- Reserve enough tablet/desktop page margin for the fixed Contact Us tab so it does not obscure text; keep the existing phone layout.
- Centralize canonical and sitemap generation on the approved origin; omit preview sitemap entries. Use valid, known source modification dates where appropriate, never the build timestamp as a content date. Match production breadcrumb JSON-LD to the visible breadcrumb hierarchy.
- Generate `audit/build-registry.json` with actual routes, source references requiring recovery and restored asset evidence. Extend SEO checks to catch absolute internal links as well as relative ones; explicitly report known migration gaps.
- Add `content/migration-review.json` and a fail-closed release gate for source recovery, redirect relevance, business claims, property/consent verification, delivery and legacy workflow parity. Confirm 25 existing equipment redirects against explicit catalog identity mappings. Other existing redirects remain pending source recovery; no speculative redirects were added.

Validation before deployment: 26 Node 24 unit tests pass, including preview/indexing isolation, source-section preservation, canonical/sitemap behavior and existing API/import boundaries. TypeScript and the static build pass. The generated preview has 665 pages plus a real 404 document, with unique titles/descriptions, one H1, intentional noindex and an empty sitemap. Static SEO validation has no unexplained errors and lists eight known linked paths pending recovery. Source/secret pattern scanning reports no findings. No form was submitted and no search-engine submission occurred.

Remaining work requires evidence/access:

- Recover or decide the 103 missing linked page paths identified in Phase 1 (including 96 city paths and testimonials). Removing repeated directory links does not recover those destination pages. The testimonial source currently shows a database error. The old site's source/media export is still needed.
- Review 34 remaining redirect rules, including location-to-national-hub mappings, the food-service image redirect and old planning/shop workflows. They have not been claimed to be semantically equivalent.
- Restore unavailable full-size assets; the eight remaining linked destinations in the static check comprise seven pages and one image. The original Phase 1 inventory remains the preservation baseline even where links were repaired.
- Vercel lists inquiry environment names, but their downloaded preview values are empty. Obtain valid isolated preview configuration, an approved test recipient and current delivery/consent requirements. Keep online inquiries disabled until a controlled end-to-end check succeeds.
- The live site exposes Google tags GT-WVC6L47W and G-GBZ1ET4GFH. Confirm property ownership, consent and existing conversion configuration before restoring tracking; preview traffic must be excluded. No Temporary123 Search Console property is available in the connected account.
- Validate current GSA/procurement claims, source-location claims and the five editorial-noindex pages. Preserve their content and restrictions pending review.

## Launch checklist

Resolve all items in the migration review; rerun preview, API, metadata, schema, sitemap, mobile and important-journey checks; obtain a full old-site/database/media backup and tested healthy fallback; record the exact release commit and DNS settings. Obtain separate explicit launch approval. At cutover verify host and path redirects, canonical/indexing signals, preview exclusion, private API/data security, inquiries, tracking and PDFs. Submit the live sitemap only with property access. A same-domain hosting change does not by itself require Change of Address.

## Rollback

Preserve the old origin, backups and DNS records. Revert to a tested healthy old origin or previous known-good Vercel deployment when priority pages or inquiry delivery fail, public pages become unintentionally excluded, or preview protection fails. Preserve transition-period inquiries and avoid duplicate delivery. Recheck DNS/cache behavior and SEO signals after reversal. Keep valid migration redirects for at least a year. The old website is already unreliable, so validate its restoration before treating it as a safe fallback.

The proposed 30-day monitoring plan remains in the Phase 1 report; no automation has been configured. Technical checks do not establish Google indexing, rankings, backlinks recognized by Google or AI citations.
