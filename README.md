# Temporary 123 website upgrade

Upgrade of **temporary123.com**, preserving the business and source URLs. The April concept has been replaced with Temporary 123 branding and original equipment photography.

**In progress:** 625 of the source API's 98,253 public pages have been recovered. Public WordPress export requests subsequently returned HTTP 500 responses. Completing the migration requires a reliable WordPress export or hosting backup. Do not move the live domain until recovery is complete.

The frontend uses static HTML and small progressive enhancements. React/Firebase form code loads only if the inquiry form is enabled. The Realtime Database backend implements private rules, atomic rate limits, deduplicated inquiries and notification leases. Locked rules have been deployed to `temporary-123-87345-default-rtdb`.

Vercel's `temporary-124` team denies this account permission to create `temp123`. No Vercel deployment or domain cutover is claimed. Contact works by telephone; online intake remains disabled pending server credentials, App Check, notification configuration and staging verification.

## Run and verify

Use Node 24 and Java 21 for emulator tests.

```sh
npm ci
npm run build
npm run preview
npm test
npm run test:rules
npm run test:e2e
npm run check:secrets
```

Preview: `http://localhost:4173`. It serves built pages and does not execute live contact APIs. Browser tests run in GitHub Actions. Production indexing remains disabled until migration checks pass.

## Source recovery

- `content/pages/`: compressed sanitized source records keyed by original URL hash.
- `content/route-index.json`: original URLs, titles, record filenames and WordPress IDs.
- `content/migration-status.json`: recovered versus expected totals.
- `audit/backlink-reconciliation.json`: all 148 workbook rows, including missing targets.
- `content/media-map.json`: source media URLs, local assets or observed failures.
- `scripts/import-wordpress.mjs`: resumable public API recovery. Original download batches remain outside Git.

Read [the current handoff](docs/REVIEW-AND-HANDOFF.md). Earlier audit documents describe the abandoned April draft and are historical, not current release evidence.

The current technical search review is in [the SEO audit](docs/seo-audit-2026-09-12.md).
