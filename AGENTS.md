# AGENTS.md — The Origen

Single source of truth for anyone (human or agent) working on this project. Read this before touching code. If a decision here conflicts with a request, raise the conflict instead of silently overriding the brand or the security model.

---

## 1. Project snapshot

| | |
| --- | --- |
| **Client** | The Origen — gourmet Cuban restaurant |
| **Location** | Havana, Cuba |
| **Product** | Premium bilingual (ES/EN) marketing + menu + reservations website with QR analytics and an admin panel |
| **Primary market** | Havana residents, tourists planning a visit, walk-ins scanning a QR at the table |
| **Fixed deadline** | MVP live **31 December 2026**; feature freeze **18 December 2026** |
| **Effort** | ~250 hours at 5 h/day |
| **Owner of the code at the end** | The restaurant. Accounts in their name, keys rotated, documentation complete. |
| **Positioning** | Warm, intimate, sensory, elegant, never pretentious. Craft, not template. |

The restaurant's digital presence must match the room: if the site feels cheap, the kitchen is judged before the first plate arrives.

---

## 2. Why this project exists

The current public menu (`menu-origen-vercel.vercel.app`) is functional but actively damages perception:

| Area | Current problem | What we build instead |
| --- | --- | --- |
| Aesthetic | White background, thick black rules around every block. Cold, form-like, clashes with the delicate logo. | Warm near-black background, soft gold accents, the logo's fine arch as a detail. |
| First screen (mobile) | Logo fills almost the entire viewport. No headline, no reserve button, no dish. | Compact hero: signature dish, one idea, "Reservar mesa" CTA. |
| Imagery | No food, cocktail or interior photography. | Real photography in hero, Chef's suggestions and recommended dishes; quality vector illustration as fallback. |
| Typography | Three competing styles; dish names in wide-tracked all caps. | Two families: Cormorant Garamond + Manrope. Caps only in small labels. |
| Navigation | 2.5 categories visible, a name cut off, sometimes two categories underlined at once. | Reliable active indicator, clear horizontal scroll, keyboard reachable. |
| Menu reading | ~330 px per dish, ~3 per screen; price floats mid-description. | Compact cards, price aligned with the name, 3–4 per 360 px screen. |
| Content | Placeholder `"..."` descriptions; "Berenjera" instead of "Berenjena"; inconsistent Title Case; vague copy. | Editorial review, complete descriptions, sentence case, style guide. |
| Prices | Only `$`, no currency. Sparkling water $5.00 vs still water 250 ml $2.00. | `USD` explicit, prices confirmed with the restaurant. |
| Menu structure | "Coctelería" mixes cocktails, beers, soft drinks, juices and Michelada/Chelada services; ~100 items in one scroll, no search. | Separate categories (Cocktails, Beers, Non-alcoholic), search, `Recomendado` tag. |
| Headings | Chef's suggestions and desserts use a different heading level. | Uniform heading structure. |
| Performance | Logo requested as a 1920 px PNG. | SVG or correctly sized WebP/AVIF. |
| SEO | Title "Menú Origen", one-line description, `theme-color #ffffff`, no OG, no JSON-LD. | Unique titles per locale, OG, JSON-LD, dark theme-color. |
| Business | No reservations, no WhatsApp, no hours, no address, no phone. | Reservations with WhatsApp handoff and visible contact data. |
| Guest info | No allergens, no vegetarian labels. | Per-dish tags. |

**North star:** a fast, elegant, trustworthy site that turns lookers into seated guests and lets the team update the menu without a developer.

---

## 3. MVP scope

### In scope

- Redesigned site, dark theme by default, cream light theme with a persisted toggle.
- Bilingual ES/EN with a visible switch on every page.
- Digital menu: categories, search, USD prices, `Recomendado` tag, dietary/allergen tags, statically generated with revalidation under 1 minute.
- **"Agotado hoy" toggle:** staff can mark an item unavailable for the current service; the public menu reflects it on the next revalidation (≤ 60 s) with a non-alarming state.
- **Offline menu (PWA):** the menu and its images are cached so it remains readable on a weak or absent connection.
- Reservations stored in the database, assigned to physical tables, confirmed manually by staff, with a WhatsApp deep link handoff.
- **Add to calendar (.ics)** on the confirmation screen.
- QR menu at `/qr/origen` with scan counting.
- Admin panel: menu editing, table and capacity configuration, reservation management, roles, audit log.
- **Story + Gallery pages** (brand trust and SEO content).
- Basic SEO, `.com` domain, Vercel deployment.
- Documentation: `README.md`, `ADMIN-MANUAL.md`, `RUNBOOK.md`, backup procedure.

### Approved scope additions (agreed after the proposal)

| Addition | Effort | Why it earns its place |
| --- | --- | --- |
| "Agotado hoy" toggle | ~6 h | Stops guests ordering what the kitchen cannot serve; removes phone calls |
| Offline menu (PWA) | ~8 h | Cuban mobile networks are unreliable; the menu always opens |
| Add to calendar (.ics) | ~3 h | Fewer no-shows, no backend cost |
| Story + Gallery pages | ~14 h | The site becomes a brand, not a price list; adds indexable content |
| Table-level capacity + manual confirmation | ~12 h | Matches how the restaurant actually seats people |
| Token-based admin access | ~8 h | Works without reliable email delivery in Cuba |

**Decided sequencing:** the **public site launches on 31 December 2026**; the **admin panel is completed in January 2027** (freeze 15 Jan). Total effort ~301 h. The proposal's 250 h does not cover the approved scope, and this sequencing is how the gap is absorbed without degrading the public experience.

December admin scope (minimum viable operations): token login, reservation queue with table assignment, menu price/description editing, WhatsApp alert. January scope: table and zone configuration, sold-out toggle, roles, audit view, QR analytics, staff training.

### Explicitly out of scope for the MVP

- Online payments or deposits.
- Delivery / takeaway ordering.
- Loyalty programs, customer accounts for guests.
- Multi-location support.
- Native mobile apps.
- Automated review collection.

### Feature freeze rule

- **Public site:** after **18 December 2026**, only bug fixes, security, accessibility and performance work. No new public-facing features.
- **Admin panel:** continues into January under its own freeze on **15 January 2027**. Nothing ships to the public site during that window without a regression pass.
- The last two weeks of December exist to make the public experience solid and hand it over — not to squeeze in features.

---

## 4. Brand & content

### Voice

Warm, elegant, confident, sensory, never pretentious. Describe each dish through the senses, not through adjectives. No clichés ("una explosión de sabores" is banned). Spanish uses **sentence case** — only the first word and proper nouns capitalized. English keeps the same register and respects Cuban cultural context; it is written for English speakers, not translated word-for-word.

### Design philosophy

- Depth, warmth, and the feel of craftsmanship. Nothing generic, nothing template-like.
- **Neumorphism only on a few surfaces** — menu cards and primary buttons — to give tactility. Never as decoration, never on inputs.
- **Gold as a discrete accent**: hairlines, icons, active states. Never large gold blocks.
- **Dark by default** to match the room; **cream light theme** as the alternative.
- Real photography is the emotional anchor. Until it exists, high-quality vector illustration.
- The logo's fine arch is a recurring motif: section dividers, card corners, loading states.

### Editorial rules

- Sentence case everywhere; no Title Case, no all-caps dish names.
- Prices always include currency: `$12.00 USD`.
- No placeholder text ships. No `"..."`, no lorem ipsum, no "TODO".
- Every dish description is unique. Never reused across items.
- Fix the existing typos during migration (Berenjera → Berenjena, etc.).

### Client dependencies

- **English copy must arrive by 19 November 2026.** It is the only content blocker for the bilingual launch.
- **Photography and vector logo are not available yet.** Launch uses designed placeholders tracked in `content/media.ts`; replacing them later is one config change, not a redesign.
- If English copy is late: launch Spanish-first with a visible "English coming soon" state only if the owner accepts it; otherwise the bilingual launch moves.
- These are contractual assumptions, not surprises.

---

## 5. Design system

### Typography

| Role | Family | Usage |
| --- | --- | --- |
| Display / headings | **Cormorant Garamond** | 400/500/600, `clamp()` sizes, tight tracking at display sizes |
| Body / UI | **Manrope** | 400/500/600, generous line-height |

Loaded with `next/font`, `display: "swap"`, `latin` + `latin-ext` subsets, preload only what is above the fold. Total font payload < 80 KB.

### Color tokens

```css
:root[data-theme="dark"] {
  --bg: #14100D;          /* warm near-black brown */
  --bg-elevated: #1C1713;
  --surface: #221C17;
  --border: #342B23;
  --text: #F4EDE4;
  --text-muted: #B8A897;
  --gold: #C9A227;
  --gold-soft: #E0C878;
  --danger: #E06C5A;
  --success: #6FA97A;
}
:root[data-theme="light"] {
  --bg: #FAF6EF;          /* cream */
  --bg-elevated: #FFFFFF;
  --surface: #F3EDE3;
  --border: #E2D8C9;
  --text: #241C15;
  --text-muted: #6B5C4D;
  --gold: #9C7C1E;
  --gold-soft: #B8901F;
}
```

- Contrast AA in **both** themes: body ≥ 4.5:1, large text ≥ 3:1, focus ring ≥ 3:1.
- Radii: 2 px hairlines/details, 10–14 px cards, pill only for tags and the primary CTA.
- Motion 150–250 ms, ease-out, `prefers-reduced-motion` respected.
- Spacing on a 4 px base; section rhythm generous on desktop, tight on mobile.

### Placeholder media policy (decided)

No photography or vector logo exists yet, so placeholders are a **designed state**, not a hole.

- A placeholder is never a gray box, a stock photo, or "imagen próximamente".
- Use a brand-consistent composition: warm gradient/texture derived from `--bg` + `--surface`, the arch motif as a hairline, and the dish name set in Cormorant. It must look intentional at 360 px.
- Every placeholder uses the **exact aspect ratio and box** of the final asset, so swapping it causes zero layout shift.
- A single registry (`content/media.ts`) lists every asset, its owner, format, due date and status (`placeholder` → `received` → `optimized` → `live`). Nothing is replaced by hand in five places.
- The hero still carries the headline and the "Reservar mesa" CTA. The message never depends on the image.
- Swapping to real media is one config change plus the optimized file — no layout rework.
- Launch is allowed with designed placeholders only if the registry has a dated owner for each asset. If no date exists, the asset is a scope risk, not a design choice.

### Theme & locale

- Theme and locale are persisted in cookies and read server-side to avoid a flash of the wrong state.
- `theme-color` follows the active theme (`#14100D` / `#FAF6EF`).
- Locale routing is `/es` and `/en`; `/` redirects to `/es` (308).

---

## 6. Information architecture

| Route | Purpose | Rendering | Indexable |
| --- | --- | --- | --- |
| `/` | Redirect to `/es` | — | — |
| `/es`, `/en` | Home: hero, signature dish, Chef's suggestions, recommended, hours, contact | Static + ISR | ✅ |
| `/es/menu`, `/en/menu` | Full digital menu with categories and search | Static + ISR (`revalidate = 60`, tag `menu`) | ✅ |
| `/es/historia`, `/en/historia` | Story, team and craft (brand + SEO content) | Static + ISR | ✅ |
| `/es/galeria`, `/en/galeria` | Gallery of dishes, cocktails and the room | Static + ISR (tag `gallery`) | ✅ |
| `/es/reservar`, `/en/reservar` | Reservation form | Dynamic | ✅ |
| `/es/gracias`, `/en/gracias` | Confirmation, `.ics` download + WhatsApp CTA | Dynamic | ❌ noindex |
| `/es/privacidad`, `/en/privacidad` | Privacy and cookies | Static | ✅ |
| `/qr/origen` | QR landing, records the scan, forwards to the menu | Dynamic, no-store | ❌ noindex |
| `/admin` | Dashboard | Dynamic, auth | ❌ noindex |
| `/admin/menu` | Menu editor | Dynamic, auth | ❌ noindex |
| `/admin/reservas` | Reservation management | Dynamic, auth | ❌ noindex |
| `/admin/usuarios` | Users and roles (owner/developer) | Dynamic, auth | ❌ noindex |
| `/admin/auditoria` | Audit log (owner/developer) | Dynamic, auth | ❌ noindex |
| `/api/**` | Route handlers | Node runtime | ❌ |

Sitemap includes public localized routes only. `robots.ts` blocks `/admin`, `/api`, `/gracias`, `/qr`.

---

## 7. Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js (App Router)** | Static menu, server components, route handlers, ISR |
| Hosting | **Vercel Pro** | Edge CDN, previews, cron, `waitUntil` |
| Language | **TypeScript** (strict) | Safety at the boundary |
| Styling | **Tailwind CSS + CSS variables** | Tokens, theming, small CSS payload |
| Database | **Supabase Postgres** | RLS, Auth, Storage, generous free/pro tier |
| Auth | **Custom access tokens + short-lived JWT sessions** | Works without reliable email delivery; regenerable; hash-only storage |
| Validation | **Zod** (shared client/server) | One schema, two enforcement points |
| Forms | React Hook Form | Small, accessible, uncontrolled-first |
| Animation | Framer Motion (sparingly) | Meaningful transitions only |
| E2E | Playwright | 360 px flows, both locales |
| Unit | Vitest + Testing Library | Schemas, services, formatting |
| Package manager | pnpm | Deterministic, fast, lockfile committed |

No CSS-in-JS runtime. No UI kit that ships 300 KB. No state library unless justified.

---

## 8. Architecture

```text
Guest (mobile / desktop)
        │  HTTPS (TLS 1.3)
        ▼
┌─────────────────────────────────────────────┐
│ Vercel Pro                                  │
│ Next.js (App Router)                        │
│  • Static pages: home, menu (ISR 60 s)      │
│  • Route Handlers: app/api/** (Node.js)     │
│  • Middleware: CSP nonce, locale, session   │
└───────────────────┬─────────────────────────┘
                    │ service_role (server only)
                    ▼
┌─────────────────────────────────────────────┐
│ Supabase (PostgreSQL + RLS)                 │
│ categories · menu_items · reservations      │
│ admin_users · audit_log · qr_scans          │
│ Token-based admin auth · Storage (images)   │
└─────────────────────────────────────────────┘
```

### Data rules

- The public can only read the published menu.
- `audit_log` accepts inserts only; no updates, no deletes.
- `service_role` never leaves the server.
- Every table has RLS enabled.
- Reservations and QR rows are never publicly selectable.

### Repository layout

```text
src/
├─ app/
│  ├─ [locale]/{page,menu,reservar,gracias}
│  ├─ qr/origen/
│  ├─ admin/{menu,reservas,usuarios,auditoria}
│  ├─ api/**/route.ts
│  ├─ sitemap.ts · robots.ts · opengraph-image.tsx
│  └─ globals.css
├─ components/{ui,menu,reservations,admin,layout}
├─ lib/{i18n,theme,format,supabase,seo}
├─ server/
│  ├─ modules/{menu,reservations,qr,admin,audit}
│  ├─ lib/{db,errors,rate-limit,logger,result}
│  └─ http/handler.ts
├─ content/{es,en}.ts
└─ types/database.ts        # generated from Supabase
supabase/migrations/*.sql
tests/{unit,e2e}
docs/
```

---

## 9. Data model

| Table | Key columns | Notes |
| --- | --- | --- |
| `categories` | `id`, `slug`, `name_es`, `name_en`, `sort_order`, `is_published`, `archived_at` | Ordered sections of the menu |
| `menu_items` | `id`, `category_id`, `slug`, `name_es`, `name_en`, `description_es`, `description_en`, `price`, `currency`, `is_recommended`, `dietary_tags[]`, `allergens[]`, `image_path`, `is_published`, `availability_status`, `unavailable_until`, `sort_order`, `archived_at` | `price numeric(10,2)`, `currency 'USD'`; `availability_status` ∈ `available`/`sold_out` |
| `restaurant_tables` | `id`, `label`, `seats`, `min_party`, `max_party`, `zone`, `is_active`, `combinable_group` | Physical floor plan; MVP seeds 8–10 tables; labels visible to staff only |
| `table_combinations` | `id`, `table_ids uuid[]`, `total_seats`, `is_active` | Pre-approved joins for parties larger than any single table |
| `reservations` | `id`, `reference`, `name`, `contact`, `contact_hash`, `party_size`, `reservation_date`, `reservation_time`, `duration_minutes`, `status`, `notes`, `locale`, `source`, `created_at` | Status: `pending → confirmed → seated → completed`, plus `cancelled`, `no_show`, `expired` |
| `reservation_tables` | `reservation_id`, `table_id` | One row per assigned table or combination member |
| `admin_users` | `user_id`, `role` (`owner`/`staff`/`developer`), `is_active`, `created_by` | Source of truth for roles — never `user_metadata` |
| `admin_access_tokens` | `id`, `admin_user_id`, `token_hash`, `label`, `expires_at`, `used_at`, `revoked_at`, `created_by` | Only the hash is stored; plaintext shown exactly once |
| `audit_log` | `id`, `actor_id`, `actor_role`, `action`, `entity`, `entity_id`, `diff jsonb`, `ip_hash`, `created_at` | Insert-only |
| `qr_scans` | `id`, `slug`, `channel`, `scanned_at`, `ip_hash`, `ua_family` | No raw IPs, no cookies |

Conventions: `uuid` primary keys with `gen_random_uuid()`, `created_at`/`updated_at` timestamptz, soft delete for menu content, explicit FKs with `on delete` behaviour, enums for statuses and roles.

### Indexes & constraints that matter

- Overlap constraints at the **table** level: a table cannot hold two active reservations in the same time window. Use a Postgres exclusion constraint with `tstzrange` + `btree_gist`, or an equivalent transactional check as a fallback.
- Unique partial index preventing duplicate active reservations per `(contact_hash, reservation_date, reservation_time)`.
- Unique index on `menu_items.slug` and `categories.slug`.
- Index on `reservations(reservation_date, status)`, `reservation_tables(table_id)`, `qr_scans(slug, scanned_at)`, `admin_access_tokens(token_hash)`.
- Check constraints: `party_size between 1 and 12`, `price >= 0`, `seats between 1 and 12`.
- **Capacity model:** table-based. A reservation occupies one table or one pre-approved combination for its whole time window, including a buffer for turnover. The database — not application code — is the authority on double-booking.

---

## 10. API surface

| Method | Route | Auth | Behaviour |
| --- | --- | --- | --- |
| GET | `/api/menu` | public | Cached, tag `menu`, `revalidate` 60 |
| POST | `/api/reservations` | public | Zod, honeypot, rate limit, transactional capacity check, returns reference + WhatsApp URL |
| GET | `/api/reservations/[ref]` | public + contact proof | Minimal status only |
| PATCH | `/api/admin/reservations/[id]` | staff+ | Status transitions only |
| GET/POST/PATCH/DELETE | `/api/admin/menu/**` | staff+ | Writes revalidate `menu` and write an audit event |
| POST | `/api/qr/scan` | public | Count only, aggressive rate limit, never blocks the redirect |
| GET | `/api/admin/analytics/qr` | owner/developer | Aggregates by day and channel |
| POST | `/api/admin/users/invite` | owner/developer | Role assignment + audit |

Response contract:

```ts
type Ok<T> = { ok: true; data: T };
type Err   = { ok: false; error: { code: string; message: string; fields?: Record<string, string> } };
```

Error codes: `VALIDATION` 422, `UNAUTHENTICATED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404, `CONFLICT` 409, `RATE_LIMITED` 429, `UNAVAILABLE` 503, `INTERNAL` 500. Never leak stack traces, SQL or provider messages.

---

## 11. Reservations flow

**Model:** table-based capacity, **manual confirmation** by staff.

1. Guest picks date, party size, time and preferred zone (or "no preference").
2. Availability is computed **server-side only**: which tables (or approved combinations) fit the party size for the full time window, including the turnover buffer. The client never decides what is free.
3. Submit → Zod validation (client for UX, server for truth) → honeypot → rate limit (IP + contact hash).
4. Creation happens in a single Postgres transaction/RPC that re-checks table availability and holds the assignment. An exclusion constraint on overlapping time ranges is the final guard. An idempotency key prevents duplicates from double taps or retries.
5. Result: `pending` — **not confirmed**. The guest sees "solicitud recibida" with the reference and is told the team will confirm.
6. Staff is notified immediately: dashboard badge **plus a WhatsApp message to the owner** with date, time, party size and reference. Staff confirms or rejects from the admin panel. Confirmation re-checks the table is still free at that moment.
7. On confirmation: status `confirmed`, audit event, WhatsApp deep link with the confirmed details, and the `.ics` file becomes available both on screen and in the follow-up message.
8. Status transitions are validated (`pending → confirmed → seated → completed`, `pending → expired`, `confirmed → cancelled`, `confirmed → no_show`); illegal transitions return `409`.
9. Pending requests **expire at the closing time of the requested day** (configurable per weekday). At expiry the hold is released, the status becomes `expired`, and the guest receives a courteous WhatsApp message inviting them to book another day. A reminder goes to staff 2 h before closing if the queue is still not empty.

**Operational rules**

- A pending request holds its table until closing of the requested day only. Expired holds are released by a scheduled job and the table returns to inventory.
- Staff can reassign tables on confirmation (a party of 2 may be seated at a 4-top) without losing the original request.
- Guest-side cancellation is by WhatsApp; the staff updates the status. No guest login.
- Never expose table numbers to guests. Guests see the zone, not the floor plan.
- If WhatsApp is unreachable, the reservation still exists and the page shows the reference plus a copyable message. Never lose a booking to a third party.

**Trade-off accepted (with eyes open):** confirming *at closing* means a guest who books at 11:00 may wait most of the day. Many will book elsewhere. Mitigations, all mandatory: instant WhatsApp alert to the owner, a visible "te confirmamos hoy" expectation instead of an implied instant confirmation, a staff reminder 2 h before closing, and automatic expiry so no table is blocked by silence. If the cancel/no-show rate climbs, move the SLA to 2 h during service — it is a configuration change, not a rebuild.

---

## 12. QR menu & analytics

- Physical QR codes point to `/qr/origen` (optionally with `?channel=table|poster|flyer`).
- The route records the scan asynchronously (`waitUntil`/`after()`), then redirects to the menu. Counting must never slow down or break the redirect.
- Payload is restricted to `{ slug, channel? }`. No free-form data, no cookies, no fingerprinting.
- Rate limited per IP and per slug; deduplicated within a 30 s window.
- Stored: `slug`, `channel`, `scanned_at`, salted `ip_hash`, coarse `ua_family`.
- Admin sees aggregates only (by day, by channel), never individual visitors.
- The point is business intelligence: which tables, posters and channels actually drive menu views.

---

## 13. Admin panel & roles

| Capability | owner | staff | developer |
| --- | --- | --- | --- |
| Read menu, manage reservations | ✅ | ✅ | ✅ |
| Edit menu, prices, availability | ✅ | ✅ | ✅ |
| Change reservation status | ✅ | ✅ | ✅ |
| Invite/remove users, change roles | ✅ | ❌ | ✅ |
| View audit log, export data | ✅ | ❌ | ✅ |
| Infrastructure, secrets | ❌ | ❌ | ✅ |
| Permanent deletion | ✅ + re-auth | ❌ | ❌ |

- **Auth model (decided): token-based access, no email dependency.**
  - Each admin has one or more **access tokens**: 32 random bytes, shown **exactly once** at creation, stored server-side only as a SHA-256 hash.
  - Two delivery modes: a single-use link the owner hands over in person or via WhatsApp, or a typed code for the login screen. The token is single-use and expires (default 7 days, configurable).
  - Exchanging a token issues a **short-lived session JWT** in a `HttpOnly` + `Secure` + `SameSite=Lax` cookie: 30 min idle, 12 h absolute, refresh rotated on use.
  - **Regeneration:** owner/developer can regenerate any token. Regeneration immediately revokes the old token, invalidates every active session for that user, and writes an audit event. Lost token ⇒ regenerate, never recover.
  - One active token per device is preferred; a user may hold several labelled tokens (`tablet-bar`, `oficina`) and revoke each independently.
  - Failed exchanges are rate limited (5 / 15 min per IP + per token prefix) and logged. Generic error message — never reveal whether a token exists.
  - First login forces a password-equivalent step: the token is rotated after first use and the user must set a 6-digit PIN or enable TOTP for subsequent sessions.
- TOTP MFA is **required for `owner` and `developer`**, recommended for `staff`. A single bearer token alone is not enough for admin.
- Tokens are never sent by email, never appear in URLs after the exchange, never logged, and are excluded from analytics and error reports.
- **Trade-off accepted:** a bearer token is phishable and has no second factor by itself. Mitigations above (single use, short TTL, hash-only storage, rotation, PIN/TOTP, device labels, lockout) are mandatory, not optional.
- Enforce authorization in UI **and** route handler **and** RLS.
- Destructive actions require re-authentication and are always audited.
- Admin is `noindex`, never linked from public pages, and rate limited.

---

## 14. Security plan

Baseline: **OWASP Top 10**. Every control must be visible in code or configuration.

### Controls

- **Validation:** Zod on every input, client and server; `.strict()` on writes; body size caps.
- **Headers:** HSTS (2 years, preload), strict CSP with per-request nonce and `strict-dynamic`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`, COOP/CORP `same-origin`.
- **CSRF:** cookie session + `Origin`/`Sec-Fetch-Site` verification on every mutation; no state change on `GET`; no wildcard CORS.
- **Admin access tokens:** 32-byte random, hash-only storage, single use, short TTL, labelled per device, regenerable, rotated on first use; exchange rate limited and audited; all sessions revoked on regeneration. PIN/TOTP after exchange.
- **Rate limiting:** access-token exchange 5/15 min per IP + token prefix; reservations 5/h per IP and 3/h per contact; QR 30/min per IP and 60/min per slug; admin writes 60/min per user. Always `429` + `Retry-After`.
- **RLS:** enabled on every table, tested per role. `audit_log` insert-only. `service_role` confined to `src/server`.
- **Concurrency:** transactional capacity checks, row locks, unique constraints, idempotency keys, optimistic concurrency on admin edits.
- **Secrets:** Vercel env vars only; `.env*` ignored; `.env.example` without values; nothing `NEXT_PUBLIC_` that is sensitive; rotate at handover and on any suspicion.
- **PII:** collect the minimum (name, one contact, party size, date, time, optional notes). IPs only as salted hashes. No PII in logs, errors or analytics. Retention: reservations 18 months, QR 12 months, audit 24 months.
- **Transport:** TLS 1.3, HTTPS only, HSTS after domain verification.

### Threat model

| Surface | Threat | Mitigation |
| --- | --- | --- |
| Reservations | Spam, bots, invalid data, double-booking | Honeypot, rate limit, Zod, DB-level locking, unique index |
| Admin panel | Session theft, privilege escalation, token phishing | Single-use hashed tokens, short JWT, rotation, PIN/TOTP, RBAC, audit, lockout |
| QR analytics | Count inflation, endpoint abuse | Strict payload, rate limit, dedupe window, counts only |
| Public menu | Tampering, scraping | Read-only RLS, no client writes |
| Data at rest | Guest PII leak | Minimization, RLS, encryption, retention, no PII in logs |

### Incident response (summary)

Contain (revoke sessions, rotate keys, disable endpoint) → assess (data, window, users) → notify (owner, then affected guests) → fix (patch + regression test) → post-mortem (timeline, root cause, new controls, owner, date). Full procedure in `RUNBOOK.md`.

---

## 15. SEO plan

- **URLs:** `/es/...` and `/en/...`; `/` → `/es` (308). No `?lang=`, no IP or Accept-Language redirects.
- **Canonicals:** self-referencing, absolute, one per page.
- **hreflang:** reciprocal `es`, `en`, `x-default` → `es`.
- **Metadata:** unique title (50–60 chars) and description (140–160 chars) per page and locale, via the Metadata API.
- **Structured data:** `Restaurant` (address, geo, hours, `servesCuisine`, `priceRange`, `acceptsReservations`, `hasMenu`, `sameAs`), `Menu` + `MenuItem` (with `offers` in USD), `BreadcrumbList`. Generated from live data; validated with Rich Results Test. No fake ratings.
- **Sitemap & robots:** all public localized URLs; block `/admin`, `/api`, `/gracias`; never block CSS/JS.
- **Open Graph:** per-locale 1200×630 image, < 300 KB, tested on WhatsApp, X and Facebook.
- **Server-rendered content:** the menu must be in the initial HTML, not hydrated in.
- **Local SEO:** Google Business Profile claimed and verified, NAP identical across site/JSON-LD/directories, hours synced, 10+ real photos, review replies, citations on TripAdvisor/Yelp/Apple/Bing.
- **Core Web Vitals as ranking input:** LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- **Measurement:** Search Console (both locales), Bing Webmaster + IndexNow, privacy-friendly analytics, monthly report of impressions/clicks/CTR/position/CWV, alert on indexation or canonical regressions.

Keyword starting map: home → "restaurante cubano La Habana" / "Cuban fine dining Havana"; menu → "menú restaurante La Habana" / "Havana restaurant menu"; reservations → "reservar mesa La Habana" / "book a table Havana"; QR → "menú digital QR".

---

## 16. Accessibility plan

- WCAG 2.1 **AA** in both themes.
- Full keyboard navigation, visible focus, logical order, no traps.
- Semantic landmarks and one `h1` per page; heading levels never skip.
- Real `<label>` for every field; errors linked with `aria-describedby` and `aria-invalid`.
- `aria-live="polite"` for search results, filters and toasts.
- Meaningful `alt` text; decorative images `alt=""`.
- Touch targets ≥ 44×44 px; text zoom to 200% without loss.
- Tested at 360 px and with a screen reader (NVDA or VoiceOver).
- `prefers-reduced-motion` respected.

---

## 17. Performance budgets

| Metric | Budget | How |
| --- | --- | --- |
| Hero media | < 150 KB | AVIF/WebP, correct `sizes`, `fetchpriority="high"` |
| Initial JS | < 120 KB gzip | Server components, no heavy client tree on the menu path |
| Fonts | < 80 KB total | `next/font`, subset, only used weights, preload |
| LCP on 3G | < 2.5 s | Preloaded hero, CDN, minimal blocking work |
| CLS | < 0.1 | Reserved dimensions, matched font fallbacks |
| Menu freshness | < 60 s | ISR + tag revalidation from admin |
| Offline menu | opens offline | Service worker precaches menu shell + JSON + images; stale-while-revalidate |
| Lighthouse | ≥ 90 all categories | Production build, mobile profile |

No layout jumps, no oversized images, no blocking third-party scripts. Analytics load `afterInteractive`.

---

## 18. Coding standards

- **TypeScript strict.** No `any`, no non-null assertions without a comment, no `@ts-ignore`.
- **Naming:** `kebab-case` files, `PascalCase` components, `camelCase` functions/variables, `SCREAMING_SNAKE_CASE` constants.
- **Components:** named exports; default export only for pages/layouts. Props typed explicitly; extend native props when wrapping.
- **Boundaries:** `"use client"` at the leaf, never at page level. No server-only imports in client files.
- **Data:** fetch on the server; pass serializable props; no client waterfalls.
- **Validation:** Zod schema lives once, imported by client and server.
- **Errors:** explicit, typed, mapped to the response contract; never swallow.
- **Styles:** tokens only; no magic hex, no arbitrary spacing that breaks rhythm.
- **Comments:** explain *why*, never *what*. Delete dead code; don't comment it out.
- **Dependencies:** justify size and maintenance; prefer platform features.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `security:`). One logical change per commit.
- **Reviews:** every PR checks types, lint, tests, budgets and the security checklist.

---

## 19. Environment & commands

### Environment variables

| Name | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Anon key, RLS enforced |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypasses RLS — never expose |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical origin, sitemap, OG |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | public | Reservation handoff number |
| `OWNER_WHATSAPP_NUMBER` | **server only** | Destination for new-reservation alerts |
| `IP_HASH_SALT` | server only | Salted IP hashing for QR/logs |
| `RATE_LIMIT_REDIS_URL` | server only | Distributed rate limiting (optional) |
| `NEXT_PUBLIC_ANALYTICS_ID` | public | Privacy-friendly analytics |

`.env.example` documents names with empty values. `.env*` is git-ignored. Preview deployments use a separate Supabase project and are `noindex`.

### Commands

```bash
pnpm install
pnpm dev                 # local development
pnpm build && pnpm start # production build (use this for Lighthouse)
pnpm lint
pnpm typecheck
pnpm test                # unit
pnpm test:e2e            # Playwright, 360 px + desktop
supabase start           # local stack
supabase db push         # apply migrations
supabase gen types typescript --local > src/types/database.ts
```

---

## 20. Testing & QA

- **Unit:** Zod schemas, status transitions, price formatting, WhatsApp message builder, helpers.
- **Integration:** reservation concurrency (N parallel requests → exactly one per slot), RLS behaviour per role, rate-limit boundaries, audit writes.
- **E2E (Playwright):** home → menu → search → reserve → confirmation → WhatsApp link; QR route; admin login and role gating. Run at 360 px and 1440 px, both locales, both themes.
- **Accessibility:** axe in CI plus one manual keyboard and screen-reader pass per release.
- **Performance:** Lighthouse mobile on the production build every release; budgets are pass/fail.
- **Manual matrix:** 360/390/768/1024/1440, dark/light, ES/EN, 3G throttle, empty state, 0 search results, server error, offline.

A defect is fixed only when there is evidence of the fix. "Works locally" is not evidence.

---

## 21. Delivery plan

| Phase | Dates | Content | Hours |
| --- | --- | --- | --- |
| 1. Foundation & design | 23 Oct – 5 Nov | Discovery, visual system, hero, Next.js project, Supabase schema with RLS, token-based admin auth | 45 |
| 2. Public menu | 6 – 19 Nov | Migrate data, categories, search, ES/EN, dark + light theme | 50 |
| 3. Reservations, QR & SEO | 20 Nov – 3 Dec | Form + WhatsApp, QR menu with counting, metadata and JSON-LD | 45 |
| 4. Admin core | 4 – 17 Dec | Token login, menu editing, reservation queue with table assignment, WhatsApp alert | 60 |
| 5. Public launch & QA | 18 – 31 Dec | Security, accessibility, performance, SEO, documentation, accounts in the restaurant's name, key rotation; **public site live 31 Dec** | 50 |
| 6. Admin completion | 2 – 16 Jan | Table/zone configuration, sold-out toggle, roles, audit view, QR analytics, staff training | ~51 |

Dependencies: English copy + photography by **19 Nov**; prices confirmed with the restaurant before migration; domain and hosting accounts created in the restaurant's name.

**Effort reality check:** the approved additions raise the total to ~301 h against the 250 h proposed. Options, in order of preference: (1) extend the timeline into January for the admin panel, keeping the public site live on 31 Dec; (2) add ~50 h to the budget; (3) defer Story + Gallery to v2. Do not absorb the gap silently — it shows up as defects in the last two weeks.

---

## 22. Commercial context

| Tier | Includes | Price |
| --- | --- | --- |
| Essential | Redesigned bilingual site, searchable digital menu, basic SEO, domain, deployment | 900 USD |
| Complete | Everything above + WhatsApp reservations, QR menu with analytics, admin panel with roles | 1,800 USD |
| Premium | Everything above + custom illustrations, documented accessibility and performance audit, 3 months support | 2,600 USD |

Recurring costs in the restaurant's name: Vercel Pro, Supabase, `.com` domain. Optional maintenance after included support: **60 USD/month**. Payment in two or three milestones.

### Deliverables

- Repository with the full code.
- `README.md` — installation and environment variables.
- `ADMIN-MANUAL.md` — for the restaurant team.
- `RUNBOOK.md` — operations and incident response.
- Backup procedure.
- Accounts in the restaurant's name, keys rotated at handover.

---

## 23. Agent working agreements

This repo ships specialized subagents and skills. Use the right one; do not let a single agent improvise across domains.

| Agent | Use it for | Must read |
| --- | --- | --- |
| `frontend` | Pages, components, design system, i18n, theming, a11y, frontend perf | `frontend` skill |
| `backend` | Route handlers, services, repositories, validation, reservations, WhatsApp, QR, audit | `backend` skill |
| `database` | Schema, migrations, RLS, indexes, constraints, RPCs, backups | `backend` + `security` skills |
| `security` | Threat modelling, auth, RBAC, headers, CSRF, rate limits, PII, review gates | `security` skill |
| `seo` | Metadata, hreflang, JSON-LD, sitemap, OG, local SEO, CWV, measurement | `seo` skill |
| `qa` | Accessibility, performance, responsive, i18n, E2E, release recommendation | `frontend` + `security` skills |

### Coordination rules

1. **Schema before service, service before UI.** Database → backend → frontend.
2. **Security reviews anything touching auth, admin, reservations, QR or PII** before merge.
3. **SEO reviews anything that changes routes, metadata, headings or public content.**
4. **QA signs off releases.** No release without a pass/fail report against the budgets.
5. Subagents do not modify another domain's files to "make it work"; they report the dependency instead.
6. Every subagent reports: what changed, how it was verified, what remains risky.

### Escalation

Block and ask the owner when:

- A requirement conflicts with the security model or the accessibility baseline.
- English copy or photography is missing near the deadline.
- A price, allergen or dish must be invented to fill a gap.
- A dependency or third-party service would add recurring cost or PII exposure.

---

## 24. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| English copy late | Bilingual launch slips | Spanish-first fallback documented with the owner; English added as an update |
| No photography / no vector logo | Site looks unfinished at launch | Designed placeholders with dated owners; swap path with zero CLS |
| Same-day confirmation loses bookings | Guests book elsewhere while waiting | Instant WhatsApp alert, reminder before closing, visible "te confirmamos hoy"; SLA configurable to 2 h |
| Weak mobile networks in Havana | Slow, abandoned sessions | Static menu, tiny JS, < 150 KB hero, 3G testing |
| Reservation spam | Dirty data, staff time wasted | Honeypot, rate limits, DB constraints, monitoring |
| Concurrent bookings | Double-booked tables, angry guests | Transactional locking, unique index, concurrency tests |
| Key leakage | Full data compromise | Server-only secrets, rotation at handover, no `NEXT_PUBLIC_` secrets |
| Scope creep before freeze | Quality collapses near 18 Dec | Feature freeze, change requests deferred to post-MVP |
| Restaurant cannot self-manage | Developer dependency returns | `ADMIN-MANUAL.md`, simple UI, roles, audit trail |
| Google Business profile unverified | Loses the most valuable local channel | Start verification early in phase 1 |

---

## 25. Assumptions & open questions

1. Menu data (~100 items) is migrated by scraping the current site, normalized, then **confirmed by the restaurant** — prices and descriptions are never assumed.
2. Currency is USD; no multi-currency display.
3. Timezone is `America/Havana`; service slots are configurable, not hardcoded.
4. Party size 1–12 online; larger groups go through a contact path.
5. WhatsApp is the confirmation channel; email is optional and not a launch blocker.
6. Restaurant address, phone, hours, geo coordinates and social links must be supplied before launch.
7. There is one location. No multi-branch logic.
8. Photography is not available yet; vector illustration is the launch visual. A photo session must be scheduled, not assumed.
9. Analytics must be privacy-friendly; no advertising pixels in the MVP.
10. The restaurant owns the domain, Vercel and Supabase accounts; the developer has `developer` role access.
11. **Capacity is table-based.** The MVP seeds **8–10 tables** (suggested: 4×2, 4×4, 2×6) with 90-minute turnover; the real floor plan replaces the seed before launch without a schema change.
12. **Reservations are manually confirmed, with a same-day SLA:** pending requests expire at closing of the requested day. Staff are notified instantly by WhatsApp, reminded 2 h before closing, and the guest always sees "te confirmamos hoy" — never a fake confirmation.
13. **Admin access is token-based**, delivered as a **single-use link plus a 6-digit PIN**, handed over in person or by WhatsApp, and regenerated when lost. No email dependency.
14. **No vector logo and no photography yet.** Launch uses *designed* placeholders (warm texture, arch motif, Cormorant typography) at the final aspect ratios, tracked in `content/media.ts` with a named owner and due date per asset.
15. The restaurant accepts that table-level capacity, manual confirmation and January admin delivery change the original 250 h/31 Dec scope as documented in §3 and §21.

---

## 26. Decision log

Decisions taken with the owner after the proposal. Changing any of these requires an explicit note here — not a silent code change.

| # | Date | Decision | Rationale | Consequence |
| --- | --- | --- | --- | --- |
| 1 | 25 Oct 2026 | Menu data: scrape the current site, normalize, restaurant confirms prices/descriptions | Fastest reliable source; avoids inventing prices | Phase 2 depends on restaurant confirmation |
| 2 | 25 Oct 2026 | Capacity: table-based, MVP seeds 8–10 tables | Matches how the room actually seats people | Exclusion constraints, table config UI, more complex engine |
| 3 | 25 Oct 2026 | Reservations: manual confirmation, same-day SLA (expire at closing) | Staff control and no fake confirmations | Risk of losing guests who book elsewhere; mitigated by instant WhatsApp + reminders |
| 4 | 25 Oct 2026 | Admin auth: single-use token link + 6-digit PIN, regenerable | Email is unreliable in Cuba | Custom auth flow, hash-only storage, token registry |
| 5 | 25 Oct 2026 | Add sold-out toggle, offline PWA, .ics, Story + Gallery | Operational value and brand/SEO depth | +51 h; admin work moves to January |
| 6 | 25 Oct 2026 | Legal texts drafted by us, validated by the restaurant | Faster than waiting for a lawyer, safer than omitting | Privacy/cookies/alergenos pages before launch |
| 7 | 25 Oct 2026 | No logo vector or photography at launch; designed placeholders | Neither asset exists today | Placeholder registry with dated owners; zero-CLS swap |
| 8 | 25 Oct 2026 | Public site 31 Dec 2026; admin panel completed January 2027 | Protects the public launch quality | January freeze on 15 Jan; staff trained before handover |
| 9 | 25 Oct 2026 | New reservation alert: panel badge + WhatsApp to owner | Staff are not always looking at a screen | Requires WhatsApp integration and an owner number |

---

## 27. Definition of done (project level)

- [ ] All MVP features work in ES and EN, dark and light themes, at 360 px.
- [ ] Lighthouse ≥ 90 in all four categories on mobile, production build.
- [ ] WCAG 2.1 AA verified; keyboard and screen-reader pass documented.
- [ ] Every table has RLS with tests; reservation concurrency proven.
- [ ] Security checklist signed off; no secrets in repo or bundle.
- [ ] JSON-LD valid, sitemap submitted, canonicals and hreflang correct.
- [ ] `README.md`, `ADMIN-MANUAL.md`, `RUNBOOK.md` and backup procedure delivered.
- [ ] Restaurant owns all accounts; keys rotated; staff trained on the admin panel.
- [ ] No placeholder text, no `"..."`, no unconfirmed prices.
