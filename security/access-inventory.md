# Temporary 123 access boundaries

Visitors may read static pages and use telephone contact. Online submission is disabled until deployment settings are verified. When enabled, `POST /api/contact` validates exact origin, App Check app identity, schema, body limits, idempotency and shared atomic quotas before storing an inquiry. Admin SDK callers bypass rules, so these are server responsibilities.

All direct Realtime Database client operations are denied, including authenticated clients. Operator access uses Firebase IAM. No customer login, tenants, uploads or payments are present.

`inquiries/{HMAC-id}` holds fields, payload hash, timestamps and notification state. `rateLimits/{window}` holds a bounded global counter and hashed network keys. The authenticated POST delivery job examines at most five queued records and removes at most 100 expired records per collection per run. Expiry is application cleanup, not Firebase automatic TTL.

Tests cover direct access denial, request metadata, malformed/oversized input, concurrent quotas, idempotency conflicts, competing workers and provider retry deadlines. Tests use the emulator and synthetic mail. Live evidence covers rule deployment and a denied unauthenticated read; it does not prove production delivery, IAM least privilege, backups or recovery.

No analytics/advertising scripts are installed. App Check loads only for enabled online inquiries. Server secrets never use `VITE_` prefixes. Production initialization rejects emulator targets. See `.env.example` and the handoff for remaining settings.
