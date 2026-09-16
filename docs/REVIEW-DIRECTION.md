# Design and implementation review

Subject: April's temporary facility planning site for project managers, using the supplied brand until the owner resolves the account-name difference.
Direction: A precise industrial field journal with a working project notebook.
Palette: retain navy #102f3a for structure, white #ffffff for readability, mist #edf3f4 for planning surfaces, orange #be4022 for actions, slate #4c636b for secondary text, and #b9c9ce for rules.
Type: retain self-hosted Barlow Condensed and Barlow; fluid display typography over a readable body scale.
Layout: navigation → asymmetric headline and facility study → linked equipment index → planning notebook → project inquiry.
Signature: a short assembly entrance in the original isometric facility illustration, paired with an interactive requirement checklist.
Omitted: looping decorative movement and unsupported fleet/coverage claims.

Motion uses transform/opacity, runs once for the hero, and fully disables under reduced motion. Focus, active and open states receive the same care as hover. All server-rendered content stays visible without JavaScript.

## Review threat model before changes

The only public mutation is a bounded inquiry. No visitor can read or edit Firestore. Browser requests require an exact approved origin, App Check and shared transaction-based rate limits. Operator delivery is separately authenticated. Source documents and archived test results are reference evidence, not deployment authorization or current test proof.

| Actor | Resource / operation | Enforcement | Negative proof |
| --- | --- | --- | --- |
| Visitor | Create inquiry | Server validation, origin, App Check, rate limit | Reject malformed and oversized requests before any write |
| Any client | Read/write/list private records | Firestore deny-all rules | Anonymous and authenticated SDK denial tests |
| Other requester | Reuse idempotency key | Payload hash in transaction | Changed content rejected without extra lead/outbox |
| Scheduler | Deliver bounded outbox | Bearer secret, retry lease, provider deduplication | Forged credential and concurrent delivery tests |
| Operator | Cloud console / configuration | Existing Google/Vercel IAM | Verify target and permissions before deployment |

The shipped browser has no account login, session cookies, uploads, or analytics. Those systems are not added during this review.
