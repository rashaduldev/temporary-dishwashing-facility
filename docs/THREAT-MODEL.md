# Threat model and access matrix

Public static content has no database dependency. The only public mutation is POST /api/contact. Anonymous visitors may submit bounded inquiries but cannot read, list, edit or delete any database collection. No public login, multi-tenant dashboard, upload, analytics or authenticated browser session exists. All Firestore/Storage client access is denied. Trusted operator access uses cloud IAM, not a public admin route.

| Actor/resource/action | Enforcement | Negative proof |
|---|---|---|
| Anonymous/contact create | Exact Origin, JSON, bounded body, schema, honeypot, App Check, shared rate limit | Handler rejects invalid method/origin/schema/token and outages |
| Any browser/leads read or write | Deny-all rules | Emulator anonymous and authenticated CRUD/list denials |
| Contact handler/leads create | Admin SDK, allowlisted server fields, atomic deduplication | Replay returns existing outcome; payload mismatch rejected |
| Delivery job/outbox drain | Exact Bearer cron secret, bounded query | Missing/invalid secret denied |
| Operator/leads review | Least-privilege IAM in Firebase console | Cloud IAM verification blocked by account permissions |

Store only submitted contact fields, createdAt, expiry and delivery status. Rate keys are HMACs of platform-controlled client IP, not raw IPs. No data in browser localStorage. No authentication cookies or tracking cookies. App Check provider may have its own browser storage and privacy implications; verify on staging before release. Contact forwarding means sending form details to one configured inbox; it does not create a general inbound email forwarding service.

Rate policy: 5 accepted attempts per IP per 15-minute fixed window, plus 100 global attempts per window. This is an initial operational budget subject to staging cost/traffic review; fixed windows allow boundary bursts. Firestore transaction is shared across function instances. Reject if limiter unavailable. Direct Vercel ingress only; no unverified upstream reverse proxy. Live database creation is denied and server credentials remain unconfigured, so local tests do not prove production App Check, IAM, rules deployment, email delivery or backups.
