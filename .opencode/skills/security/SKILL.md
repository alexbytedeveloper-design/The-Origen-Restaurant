---
name: Security — The Origen
description: Hardening and threat modelling for The Origen. Use for authentication and roles, RLS policies, CSP and headers, CSRF, rate limiting, secrets, PII handling, concurrency safety, audit logging, incident response and security reviews.
---

# Security Skill — The Origen

The restaurant's reputation is the asset. A breach is not a bug, it is the end of trust. Security is a **design constraint**, not a phase.

## Baseline

OWASP Top 10 is the floor, not the ceiling. Every control below must be verifiable in code or configuration — "we assumed" is not a control.

## Threat model (MVP)

| Surface          | Primary threat                                      | Controls                                                                      |
| ---------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| Reservation form | Spam, bots, junk data, double-booking               | Zod, honeypot, IP+contact rate limit, DB-level capacity lock, idempotency     |
| Admin panel      | Session theft, privilege escalation, token phishing | Single-use hashed tokens, short JWT, rotation, PIN/TOTP, RBAC, audit, lockout |
| QR analytics     | Count inflation, endpoint abuse                     | Strict payload, aggressive rate limit, dedupe window, counts only             |
| Public menu      | Content tampering, scraping                         | Read-only RLS, no client writes, service-role only server-side                |
| Data at rest     | Leak of guest PII                                   | Minimal collection, RLS, encryption, no PII in logs, retention policy         |
| Supply chain     | Malicious dependency                                | Lockfile, audit in CI, pinned versions, no unvetted packages                  |
| Availability     | Traffic spikes, DoS                                 | Rate limits, static menu, CDN caching, timeouts, graceful degradation         |

## Authentication (decided: token-based, no email dependency)

**Why:** email magic links fail in Cuba — spam filters, blocked providers, staff without reliable inboxes. A lost link must not mean a lost shift.

- **Access token:** 32 random bytes (`crypto.randomBytes(32)`, base64url). Shown to the creator **exactly once**; stored only as `sha256(token)` in `admin_access_tokens`.
- **Single use:** exchanging a token sets `used_at`, rotates the secret, and cannot be replayed. Default TTL 7 days (configurable per token).
- **Exchange:** `POST /api/admin/auth/exchange` validates the token, issues a short-lived session JWT, sets the cookie, and audits the event.
- **Session:** JWT `HttpOnly` + `Secure` + `SameSite=Lax` + `Path=/`; 30 min idle, 12 h absolute; refresh rotated on each use; `jti` bound to the token row so revocation is immediate.
- **Regeneration:** owner/developer rotates a token → old token revoked, `used_at` kept for forensics, **all sessions of that user invalidated**, audit written. Plaintext is never recoverable; lost means regenerate.
- **Device labels:** `tablet-bar`, `oficina`, `owner-phone`. Revoke individually. Cap active tokens per user (e.g. 5).
- **Second factor:** first successful exchange forces token rotation plus a 6-digit PIN or TOTP enrolment. TOTP is **required for `owner` and `developer`**, recommended for `staff`.
- **Brute force:** 5 exchanges / 15 min per IP and per token prefix; constant-time hash comparison; generic error (`Código inválido`) that never reveals existence or expiry.
- Never put a token in a URL that survives the exchange: redirect with `replaceState`, no `Referer` leakage (`Referrer-Policy`), never log it, never send it to analytics or error tracking.
- No token in email. Delivery is in person or via WhatsApp, and the message is deleted after use when practical.

## Authorization

Roles: `owner` · `staff` · `developer`.

| Capability                        | owner             | staff | developer |
| --------------------------------- | ----------------- | ----- | --------- |
| Read menu, manage reservations    | ✅                | ✅    | ✅        |
| Edit menu, prices, availability   | ✅                | ✅    | ✅        |
| Change reservation status         | ✅                | ✅    | ✅        |
| Invite/remove users, change roles | ✅                | ❌    | ✅        |
| View audit log, export data       | ✅                | ❌    | ✅        |
| Infrastructure/secrets            | ❌                | ❌    | ✅        |
| Delete data permanently           | ✅ (with re-auth) | ❌    | ❌        |

Rules:

- Enforce in **three** places: UI affordance, route handler, RLS policy. UI hiding is not authorization.
- Every admin route calls `requireRole()` before any query.
- **Never** trust a role claim from the client or from `user_metadata` (user-editable). Roles live in `admin_users`, read via a security-definer function or a server-side lookup.
- Deny by default. New endpoints start closed.

## Input & output

- Zod `.strict()` on every write schema; trim, cap length, reject control chars.
- Allow-list enums for statuses, categories, channels, locales.
- All DB access through the Supabase client / parameterized RPCs. No string-built SQL, ever.
- Escape/encode on output; never `dangerouslySetInnerHTML` with user or CMS content. If rich text is ever needed, sanitize with a maintained library on the server.
- Validate `Content-Type`, cap body size (≤ 32 KB for forms, ≤ 1 MB for uploads), reject non-JSON where JSON is expected.
- File uploads (menu photos): validate magic bytes, allow `image/jpeg|png|webp|avif`, max 5 MB, strip EXIF, randomize filenames, serve from a dedicated bucket with no execution.

## RLS (mandatory on every table)

Pattern per table:

```sql
alter table public.menu_items enable row level security;

-- public read of published, non-archived rows only
create policy "menu_public_read" on public.menu_items
  for select to anon, authenticated
  using (is_published and archived_at is null);

-- staff write
create policy "menu_staff_write" on public.menu_items
  for all to authenticated
  using (public.current_role() in ('owner','staff','developer'))
  with check (public.current_role() in ('owner','staff','developer'));
```

Rules:

- `current_role()` is a `security definer` function reading `admin_users`, `set search_path = public`, `stable`.
- Reservations: no public `SELECT`. Public creates via route handler only (service role or a `security definer` RPC with strict checks). Guests verify with reference + contact hash through the API.
- `audit_log`: `INSERT` for staff+, `SELECT` owner/developer, **no** `UPDATE`/`DELETE` policies.
- `qr_scans`: `INSERT` via RPC only, `SELECT` aggregated for owner/developer.
- `admin_access_tokens`: no `SELECT` for anyone through the API — only the security-definer exchange function reads `token_hash`. Owner/developer may see metadata (label, created, last used), never the hash. `UPDATE` limited to rotation/revocation; `DELETE` only by owner with re-auth.
- `restaurant_tables` / `table_combinations`: `SELECT` staff+, write owner/developer only. Guests never see the floor plan.
- Test policies: for each table, assert anon/staff/owner/dev behaviour. A policy without a test is a guess.
- `service_role` bypasses RLS — that is exactly why it stays server-side and is imported in exactly one module.

## HTTP security headers

Set in `next.config` / middleware. Exact intent:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self';
  script-src 'self' 'nonce-<per-request>' 'strict-dynamic';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://<supabase-storage-host>;
  font-src 'self';
  connect-src 'self' https://<supabase-host> https://wa.me;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self' https://wa.me;
  object-src 'none';
  upgrade-insecure-requests
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

- Generate a fresh CSP nonce per request in middleware; never `unsafe-inline` for scripts.
- No `unsafe-eval` in production. If a library needs it, replace the library.
- HSTS only after HTTPS is confirmed for the domain and subdomains.

## CSRF

- Mutations are `POST/PATCH/DELETE` only; no state change on `GET`.
- Cookie session + **double check**: verify `Origin`/`Sec-Fetch-Site` on every mutating request; reject mismatches with `403`.
- Use SameSite=Lax (not None). For any cross-site form, use an explicit token.
- No CORS wildcard. Allow only the production domain and localhost in development.

## Rate limiting & abuse

- Distributed limiter (Redis) or Postgres fallback; keyed by IP **and** identity where available.
- Limits as defined in the backend skill. Always `429` + `Retry-After`.
- Honeypot on public forms; silently accept and discard. Log `spam_blocked`.
- Cap request size and execution time; set DB statement timeout.
- Fail-open for read paths (availability), fail-closed for auth and reservation writes.

## Concurrency (this is a security concern too)

- Reservation capacity enforced inside a transaction with row locks. A read-then-insert check is a vulnerability, not an optimisation.
- Unique constraints as the last line of defence: an exclusion constraint prevents two active reservations holding the same table in overlapping time ranges.
- Idempotency keys for reservation creation and QR ingestion.
- Optimistic concurrency (`updated_at` / version column) on admin edits so two staff edits cannot silently overwrite each other.
- Retries with jittered backoff and a hard cap; no unbounded loops.

## Secrets

- `SUPABASE_SERVICE_ROLE_KEY`, `WHATSAPP_NUMBER`, `IP_HASH_SALT`, `AUTH_SECRET` live only in Vercel env vars / local `.env.local`.
- `.env*` git-ignored; `.env.example` documents names without values.
- Never prefix a secret with `NEXT_PUBLIC_`.
- Rotate on handover to the restaurant (contractual deliverable), on staff departure, and after any suspected exposure.
- Separate Supabase projects for preview/dev vs production. Preview deploys never touch production data.
- Logs, error reports, and analytics must not receive secrets or tokens.

## PII & retention

- Collect only: name, one contact channel, party size, date, time, notes (optional).
- No marketing consent by default; no third-party trackers beyond privacy-friendly analytics.
- IPs stored only as salted hashes (`sha256(salt + ip)`), salt rotated quarterly.
- Retention: reservations 18 months, then anonymize; QR rows 12 months; audit log 24 months.
- Data subject requests: documented path to export/delete by reference + contact verification.

## Logging & monitoring

- Security events: login success/failure, role change, MFA change, rate-limit trip, spam block, admin export, failed authorization.
- Format: `{ event, outcome, actorId?, role?, ipHash?, requestId, ts }`. Never the email or phone in clear.
- Alert on: spike in 401/403, repeated magic-link requests for one email, unusual admin export volume, QR ingest error rate.

## Incident response (summary; full version in RUNBOOK.md)

1. Contain: revoke sessions, rotate keys, disable the affected endpoint.
2. Assess: which data, which window, which users.
3. Notify: owner first, then affected guests if PII was exposed, within the legal window.
4. Fix: patch, add a regression test, deploy.
5. Post-mortem: timeline, root cause, controls added, owner and date.

## Security review checklist (run before every release)

- [ ] No secrets in the repo, bundle, or logs.
- [ ] `service_role` imported only under `src/server`.
- [ ] Every route handler: auth → role → validation → rate limit → handler.
- [ ] Every table has RLS enabled and tested per role.
- [ ] CSP has no `unsafe-inline`/`unsafe-eval` for scripts.
- [ ] HSTS, nosniff, frame-ancestors, Referrer-Policy present in production response.
- [ ] Cookies are HttpOnly + Secure + SameSite=Lax.
- [ ] Origin check on all mutations.
- [ ] Reservation creation proven concurrency-safe.
- [ ] Audit log insert-only and populated for mutations.
- [ ] No PII in logs, error messages, or analytics.
- [ ] `pnpm audit` clean; lockfile committed.
- [ ] Dependencies pinned; no unknown packages.
- [ ] Error responses leak no internals.
- [ ] Admin destructive actions require re-auth.
