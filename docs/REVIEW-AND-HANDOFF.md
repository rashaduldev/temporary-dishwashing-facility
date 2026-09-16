# Temporary 123 — current review

## Implemented

- Replaced April with Temporary 123 branding, the published (800) 443-5212 telephone number, blue/navy design, equipment catalog and original branded kitchen, restroom/shower and sleeper photographs.
- Preserved text and URL records for 625 recovered pages. Built 631 HTML routes including the new homepage, planning and contact pages. Removed executable scripts, styling and old embedded forms from imported markup.
- Moved large repeated city directories out of equipment page bodies into the catalog. Compressed source records retain the recovered text. Unrecovered links point to the current original site during preview; they do not constitute completed migration.
- Reduced shared JavaScript from roughly 340 KB to 2.83 KB before gzip (about 1.34 KB gzip). Form code loads separately only when enabled. This is a bundle measurement, not a production Core Web Vitals claim.
- Added native keyboard-accessible mobile navigation, filtering of recovered pages, entry/hover motion and reduced-motion support.
- Replaced Firestore with Realtime Database. Inquiry fields and delivery state are stored atomically at `inquiries/{hashed-id}`. Rate limits, leases and expiry metadata remain private. The authenticated delivery job includes bounded expiry cleanup.
- Deployed locked rules to the existing database. An unauthenticated live inquiry read returned HTTP 401 Permission denied.

## Verification

Build and TypeScript checks pass. Twenty-one contact/API/import tests and seven Realtime Database emulator tests pass. Tests cover anonymous/authenticated access denial, concurrent quotas, idempotency conflicts, competing notification workers, failed delivery retry and provider deduplication deadlines. The mail provider in tests is synthetic; no external test email was sent.

The recovered-content scan found no executable scripts, inline handlers, embedded forms or iframes. Empty and duplicate source records are listed in `audit/content-review.json`; this does not validate every old business claim.

## Incomplete work and access needed

1. **Full source recovery:** WordPress reported 98,253 pages; 625 have been recovered. Public export requests later returned HTTP 500. A WordPress export or hosting backup, with media, is needed to complete the requested migration. Direct HTML fallback results are separately logged.
2. **Backlinks:** all 148 workbook rows are accounted for. Initially 21 matched recovered content and four were homepage variants; 123 still needed source recovery. No blanket homepage redirects were created. The machine-readable reconciliation is authoritative if totals change.
3. **Media:** 186 working source images are downloaded to `public/media`. Failed images are omitted from rendered articles, not replaced with unrelated equipment photos. Original references and failure statuses remain recorded. Full media recovery is incomplete.
4. **Vercel:** browser and CLI deny project creation in Temporary 123 (`temporary-124`). A team owner must grant the signed-in account project-creation access. No unrelated team was used and no domain settings were changed.
5. **Online intake:** rules are live, but server credentials, App Check, notification sender/recipient and authenticated job scheduling are not verified in Vercel. Public contact uses the published telephone number; online inquiry collection is disabled.

Production indexing and domain cutover remain blocked by actual migration completeness checks. The current live site remains the canonical business site during review.
