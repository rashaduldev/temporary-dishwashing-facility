# Deployment setup for the reviewed project

GitHub: https://github.com/markravencanete50-source/Temp123 (main).
Vercel team: Temporary 123, scope `temporary-124`; desired project `temp123`. Project creation currently returns 403. An administrator must create it or provide the necessary permission before import/deployment.
Firebase: `temporary-123-87345`. Web app `1:66308204140:web:ec828a478691818e3e1a49` is registered, but default database creation returns 403. Have the administrator create/permit that database; US region selection is proposed for the US-oriented business and needs operational confirmation.

Use Node 24, Vite, build `npm run build`, output `dist`. Configure separate preview and production Firebase projects. Never point an untrusted preview at production credentials. Deploy repository Firestore rules/indexes explicitly to the verified target after emulator tests. Storage rules are provided but no upload feature or bucket exists.

Set all applicable `.env.example` values through secure service settings. The server's `FIREBASE_APP_ID` must equal the registered app ID used by the client. Configure reCAPTCHA Enterprise/App Check for exact approved domains. Use a dedicated least-privilege server identity, distinct random rate/scheduler secrets of at least 32 bytes, a verified Resend sender, and the owner's intended inbox. No live credentials were created or copied into the repository.

Keep CONTACT_ENABLED false and site.json inquiriesEnabled false until real persistence, App Check and delivery checks pass. The browser public inquiry flag and server enabling must agree. Configure an authenticated POST scheduler for `/api/deliver`; this endpoint is not Vercel GET cron. Verify retry and retention operations before use. Firestore TTL/billing availability must be checked for the chosen plan.

Resolve public identity, phone, privacy details, service coverage and final domain with the owner. Complete the URL migration map before replacing the old site. Only then enable production mode and indexing through the release gate. Vercel preview builds always remain noindex even if the repository contains production editorial settings.

See [the handoff](REVIEW-AND-HANDOFF.md) for exact blockers and release checkpoints. Do not mark the website production-ready from a successful build alone.
