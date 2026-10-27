---
name: Backend — The Origen
description: Modular Next.js/Supabase backend for The Origen. Use for route handlers, services, repositories, Zod validation, reservations logic, WhatsApp deep links, QR scan counting, admin API, audit logging, migrations and data integrity.
---

# Backend Skill — The Origen

A small team, a fixed deadline, zero tolerance for a fragile core. Build a **modular monolith**: strict module boundaries, explicit contracts, boring technology, excellent failure behaviour.

## Golden rules
1. **`service_role` never leaves the server.** No import of the admin Supabase client in any Client Component, ever.
2. **Validate at the edge, trust nothing.** Every route handler parses input with Zod before touching a service.
3. **One module owns one domain.** No service reaches into another module's tables directly; go through its service.
4. **All writes are transactional or idempotent.** Reservations cannot be double-booked by concurrency.
5. **No PII in logs.** Log ids and outcomes, not names, emails, phones.

## Module layout
```text
src/server/
├─ modules/
│  ├─ menu/          # categories, items, public read, admin write
│  │  ├─ menu.service.ts
│  │  ├─ menu.repository.ts
│  │  └─ menu.schema.ts
│  ├─ reservations/  # availability, create, status transitions
│  ├─ qr/            # scan ingestion + aggregates
│  ├─ admin/         # users, roles, invitations
│  └─ audit/         # insert-only audit trail
├─ lib/
│  ├─ db/            # supabase server/service clients, typed Database
│  ├─ errors.ts      # AppError taxonomy + toResponse()
│  ├─ result.ts      # Result<T, E> helpers (optional, consistent)
│  ├─ rate-limit.ts
│  └─ logger.ts      # structured, redacted
└─ http/
   └─ handler.ts     # withAuth, withValidation, withRateLimit wrappers
```

Layer contract:
`route.ts` → parse/authorize → `service` → `repository` → Supabase.
Repositories may only be called by their own module's service. Services return domain objects or throw `AppError`.

## API surface (MVP)
| Method | Route | Auth | Notes |
|---|---|---|---|
| GET | `/api/menu` | public | Cached, `revalidate` 60 or tag `menu`; includes `availability_status` |
| POST | `/api/reservations` | public | Zod, honeypot, rate limit, table availability, returns `pending` + reference |
| GET | `/api/reservations/[ref]` | public-ish | Minimal status, needs reference + contact hash |
| GET | `/api/reservations/[ref]/calendar.ics` | public-ish | Only after `confirmed`; generated from the record |
| PATCH | `/api/admin/reservations/[id]` | staff+ | Status transitions + table reassignment |
| PATCH | `/api/admin/menu/[id]/availability` | staff+ | `available` / `sold_out`; revalidates `menu` |
| GET/POST/PATCH/DELETE | `/api/admin/menu/**` | staff+ | Every write triggers `revalidateTag("menu")` + audit |
| POST | `/api/admin/auth/exchange` | public (token) | Exchanges a one-time access token for a session JWT |
| POST | `/api/admin/auth/regenerate` | owner/dev | Rotates a token, revokes prior token and sessions |
| POST | `/api/admin/auth/revoke` | owner/dev | Revokes a token and its sessions |
| POST | `/api/qr/scan` | public | Rate limited, counts only, no PII |
| GET | `/api/admin/analytics/qr` | owner/dev | Aggregates by day/channel |
| POST | `/api/admin/users/invite` | owner/dev | Creates a user + first access token, audit |

Response contract:
```ts
type Ok<T>  = { ok: true;  data: T };
type Err    = { ok: false; error: { code: string; message: string; fields?: Record<string,string> } };
```
Never leak stack traces, SQL, or Supabase internals. Map unknown errors to `INTERNAL` and log the real cause server-side.

## Error taxonomy
`VALIDATION` (422) · `UNAUTHENTICATED` (401) · `FORBIDDEN` (403) · `NOT_FOUND` (404) · `CONFLICT` (409) · `RATE_LIMITED` (429) · `UNAVAILABLE` (503) · `INTERNAL` (500).
One `AppError` class with `code`, `status`, `message`, optional `fields`. Central `toResponse()`.

## Validation
- Zod schemas per module, exported and reused by the frontend form.
- Trim strings, enforce max lengths, normalize emails, validate phone with a permissive international pattern, reject control characters.
- Dates: `YYYY-MM-DD`, times `HH:mm`, timezone **America/Havana**. Store `timestamptz` in UTC; render in local time.
- Party size 1–12 (larger ⇒ "contáctanos" path).
- Notes max 500 chars, stripped of HTML.
- Reject unknown keys (`.strict()`) on write schemas.

## Reservations: correctness under concurrency
This is revenue-critical. Treat it like a booking engine.

**Decided model:** table-based capacity + **manual staff confirmation**.

- Availability is computed server-side only: which `restaurant_tables` (or `table_combinations`) fit the party for the full time window **including the turnover buffer**. Never trust a table or slot sent by the client.
- **Prevent double-booking in the database.** Use an exclusion constraint on `reservation_tables` with `tstzrange(reserved_from, reserved_to)` + `btree_gist`, or a `FOR UPDATE` transaction inside the `create_reservation` RPC. Application-level read-then-write is forbidden.
- A pending request **holds** its table only until the **closing time of the requested day** (`expires_at`, configurable per weekday). A scheduled job releases expired holds, sets status `expired`, and returns the table to inventory.
- Notify staff **immediately** on creation: dashboard badge + WhatsApp to the owner with date, time, party size and reference. Send a reminder 2 h before closing if pending items remain.
- Staff confirmation re-checks availability, allows reassigning tables (a party of 2 may take a 4-top), then sets `confirmed`.
- Status machine: `pending → confirmed → seated → completed`, `pending → expired`, `confirmed → cancelled`, `confirmed → no_show`. Reject illegal transitions with `CONFLICT`.
- Idempotency: accept `Idempotency-Key` (or derive from `contact_hash + date + time`); repeated submits return the original reference.
- Reference: short, human-readable, non-sequential (`ORG-7K4M2Q`). Do not leak volume.
- Never expose table labels or the floor plan to guests; show zone only.
- On confirmation, build the WhatsApp deep link **server-side** with restaurant, date, time, party size and reference. Never put the guest's phone in the URL.
- Generate the `.ics` from the same confirmed record: `DTSTART`/`DTEND` in UTC, `SUMMARY`, `LOCATION`, `UID` = reference, `SEQUENCE` incremented on change. Do not include guest PII beyond the name.
- Rate limit by IP **and** contact hash. Honeypot non-empty ⇒ fake success + `spam_blocked` audit event.

## QR scans
- Endpoint accepts `{ slug, channel? }` only. No free-form payloads.
- Rate limit aggressively (per IP + per slug per minute). Store `slug`, `channel`, `scanned_at`, `ip_hash` (salted), `ua_family`. **No raw IPs, no cookies, no fingerprinting.**
- Deduplicate floods with a short-lived key (`qr:{ip_hash}:{slug}`, 30 s).
- Admin reads aggregates only; never expose per-visitor rows.
- Increment must not fail the redirect: fire-and-forget with `waitUntil`/`after()`, and degrade silently.

## Audit log
Insert-only. Columns: `id`, `actor_id`, `actor_role`, `action`, `entity`, `entity_id`, `diff` (jsonb, redacted), `ip_hash`, `created_at`.
Write on: auth events, role changes, menu mutations, reservation status changes, exports, rate-limit trips.
RLS: `INSERT` allowed for authenticated staff+, `SELECT` only owner/developer. No `UPDATE`, no `DELETE` — not even for owner.

## Caching & revalidation
- Menu: static/ISR, tag `menu`. Admin mutations call `revalidateTag("menu")` and the specific item path.
- Never cache reservation or admin responses (`dynamic = "force-dynamic"`, `Cache-Control: no-store`).
- CDN-safe: no personalized HTML for public pages; locale and theme are the only variants.

## Rate limiting
Implement in `lib/rate-limit.ts` with a Redis/Upstash backend when available, otherwise a Postgres token-bucket fallback.
| Endpoint | Limit |
|---|---|
| Access token exchange | 5 / 15 min per IP + token prefix |
| Reservations | 5 / hour per IP, 3 / hour per contact |
| QR scan | 30 / min per IP, 60 / min per slug |
| Admin writes | 60 / min per user |
| Public reads | generous, but capped per IP |

Always return `429` with `Retry-After`. Never 500 on rate-limit store failure — fail open for reads, fail closed for auth writes.

## Supabase usage
- Three clients: browser (anon, RLS), server (anon + user session), service (bypasses RLS, server-only module).
- Prefer the user-session client for anything a user is allowed to do, so RLS is the second line of defence.
- Use typed `Database` definitions generated from the schema (`supabase gen types typescript`).
- Migrations via `supabase migration new` → reviewed SQL → `supabase db push`. No dashboard-only schema edits in production.
- Every table: `id uuid default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at` trigger.
- Money: `numeric(10,2)` in USD; never floats. Store `currency` explicitly as `USD`.
- Soft delete menu items (`archived_at`) so historical reservations stay readable.

## Observability
- Structured JSON logs: `level`, `msg`, `requestId`, `route`, `userId?`, `durationMs`, `outcome`.
- Redact: email, phone, names, addresses, tokens, cookies.
- Add `requestId` from `x-request-id` or generate; return it in error responses for support.
- Track: reservation success rate, slot conflicts, rate-limit trips, QR ingest failures, p95 latency.

## Testing
- Unit: validation schemas, status transitions, price formatting, WhatsApp message builder.
- Integration: reservation concurrency (N parallel POSTs → exactly one wins per slot), RLS policy tests per role, rate-limit boundaries.
- Contract: every route handler has a test for 200/401/403/422/429.
- Seed script with realistic menu data for local dev.

## Definition of done
- [ ] Zod-validated input, typed output, documented errors.
- [ ] Auth + role checked server-side, not just hidden in UI.
- [ ] Rate limited.
- [ ] Audit event written for mutations.
- [ ] Concurrency-safe writes proven by a test.
- [ ] No `service_role` reference outside `src/server`.
- [ ] Cache behaviour explicit.
- [ ] Migration committed and reversible.
- [ ] Logs contain no PII.
