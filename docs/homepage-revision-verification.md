# Homepage revision verification

The homepage now puts 800-443-5212 in the main hero action, sticky desktop navigation and a fixed mobile call bar. Equipment cards include larger source images, facility uses, normal detail links and keyboard-accessible quick-view dialogs. Planning, industry links and practical FAQs provide a clearer route from browsing to a call.

The design takes inspiration from the product presentation at https://www.medvillediabetes.com/ while retaining Temporary 123 typography, photography and business content. Motion includes an entry sequence, a site-plan line graphic, a scroll progress indicator where supported, card hover feedback and once-only planning-step entrances. Reduced-motion preferences apply in CSS and JavaScript. No animation library or tracking script was added.

## Verification on 12 September 2026, Singapore time

| Check | Result |
| --- | --- |
| TypeScript and production build | Passed; 631 static routes plus real 404 |
| Handler/import tests | 21 passed |
| Realtime Database emulator tests | 7 passed; private direct client access denied |
| Playwright browser tests | 17 passed |
| Homepage widths | 320, 390, 768, 1024, 1280, 1440 pixels; phone stays visible after scrolling |
| Shared page templates | Contact, equipment directory, equipment article, location directory and planning at 320, 768, 1024, 1440 pixels |
| Interactions | Quick-view focus containment, Escape and close-button restoration; mobile menu; native FAQs and equipment links without JavaScript |
| Generated HTML audit | 632 documents; 13,375 local links and 1,319 local image references; no missing local targets, missing descriptions, extra H1s or prohibited text punctuation |
| Secret pattern scan | 758 source/build files, zero findings; this does not prove cloud IAM configuration |
| Homepage entry script | 4.78 KB raw, 2.04 KB gzip; quote/React bundles remain deferred |
| Styles | 28.69 KB raw, 6.65 KB gzip |

Browser viewport checks are Chromium lab checks, not a claim of testing every physical device. No field Core Web Vitals or Search Console indexation measurements were available.

## SEO and copy

Core routes have specific descriptions. Four empty source descriptions now receive a descriptive fallback. Mobile source images have 480-pixel alternatives. Main content and navigation are rendered as HTML. Asterisks and em dashes are removed from rendered visitor-facing text without changing archived originals or link destinations.

Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) is descriptive advice, not a detector or a guarantee of authorship. The copy uses concrete planning information and avoids unsupported numbers or claims. Google's [helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) informs the content review.

## Remaining project work

The Vercel revision host remains noindex. Full migration still stands at 625 recovered source pages out of the previously reported 98,253. The existing backlink reconciliation and original content archive are preserved. Unrecovered external destinations and source duplicates remain migration work; this check only proves the local targets in the generated version.

No backend access policies changed in this revision. Customer inquiry collection stays disabled, and the current security evidence still has provider configuration and operational release dependencies. Passing local rules and handler tests does not certify production App Check, email delivery, IAM, recovery or monitoring. The public call action is the active contact path.

Next checkpoints: verify the new deployment and its security headers; review the design with the owner; complete source recovery and content reconciliation before enabling indexing or changing the primary domain; configure and verify inquiry intake separately before enabling it.

## Deployment runtime correction

The deployed contact endpoint initially returned a platform 500 before reaching the handler. Vercel logs identified ERR_MODULE_NOT_FOUND for an extensionless server import. Relative imports in the API/server modules now name their emitted .js files. A native Node runtime check compiles and imports the actual server modules, then asserts four safe rejection paths and private/no-store responses. This regression check is also in GitHub CI. The handler suite and seven database emulator tests passed again after the correction. A new secret scan covered 760 files with zero findings.

Vercel then exposed a second startup incompatibility: jwks-rsa 4.1 required the ESM-only jose 6 module through CommonJS. This matches the upstream report https://github.com/firebase/firebase-admin-node/issues/3181. A scoped override uses jose 5.10.0 only beneath jwks-rsa; its package exports support both require and import. The CI runtime check now disables require(esm) to reproduce the Vercel restriction. It failed before the override and passed afterward. App Check verification is retained; no verification or authorization bypass was added. Remove the override after the upstream loader compatibility fix is verified on Vercel.

## Equipment directory revision

The unstructured imported list beneath the four feature cards is replaced by 25 consistent cards in five equipment groups. Each card has a source image or clearly presented layout, a short planning description and a detail link. Search filters individual equipment entries. Group navigation and ordinary detail links remain usable without JavaScript.

All 25 legacy destinations have explicit permanent redirects to relevant equipment pages. Six new equipment briefs fill missing destinations; these are curated additions, not recovered WordPress pages. Source content and the migration archive remain intact. Future production sitemaps include all generated routes; the revision host still remains noindex.

Final local verification: 637 static routes plus a real 404; 638 HTML documents, 13,576 local links and 1,336 local image references with zero audit problems. All 23 browser tests passed, including catalog widths of 320, 390, 768 and 1440 pixels, 25 legacy redirects, detail destinations, source images and six new mobile briefs. The existing 21 handler/import tests and seven database emulator tests passed during this revision. Four native runtime boundary checks passed again. The source/build secret pattern scan covered 769 files with zero findings. Entry JavaScript is 5.62 KB raw / 2.23 KB gzip; CSS is 34.01 KB raw / 7.39 KB gzip.

Images use optimized WebP variants of the available source assets. Higher-resolution source assets replaced several thumbnails. Four source originals remain low resolution: handwashing stations, refrigerated containers, wastewater/freshwater containers and modular buildings. They are displayed without enlargement in the catalog and have original-size links. Clearer source files are still needed for those four entries; no fictional equipment specifications or photographs were invented.

The live backend compatibility corrections were verified on temp123-alpha.vercel.app: contact GET returns 405, disabled contact POST returns 503, and delivery GET returns 405, all with private/no-store responses. Customer intake remains disabled. The full 98,253-page migration and production security/provider readiness remain separate outstanding project work.
