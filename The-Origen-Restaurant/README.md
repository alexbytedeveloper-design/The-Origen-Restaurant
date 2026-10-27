# The Origen — Restaurant Website

A bilingual (Spanish / English) restaurant site for **The Origen**, a contemporary Cuban restaurant in Vedado, Havana. Dark, warm and gold-accented by default, with a cream light theme. The menu is static, the reservation flow ends in WhatsApp, and the site is designed to be scanned from a QR code at the table.

This repository is a **self-contained demo**: no admin panel, no database, no customer accounts and no online payments. Everything the restaurant needs to change lives in versioned content files.

---

## Table of contents

- [What is included](#what-is-included)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Routes](#routes)
- [API](#api)
- [How reservations work](#how-reservations-work)
- [How the QR entry works](#how-the-qr-entry-works)
- [Project structure](#project-structure)
- [Content and media](#content-and-media)
- [Data migration notes](#data-migration-notes)
- [Security](#security)
- [Accessibility and performance](#accessibility-and-performance)
- [Deployment on Vercel](#deployment-on-vercel)
- [Known limitations](#known-limitations)
- [License](#license)

---

## What is included

- **Bilingual site** at `/es` and `/en`, with a visible language switch and reciprocal `hreflang`.
- **Dark / cream theme** persisted in a cookie; dark is the default.
- **Digital menu** with 8 categories, 20 sections, 93 entries (92 priced dishes plus one house note), 12 chef recommendations, instant search and a “recommended only” filter.
- **Per-dish artwork**: 93 generated WebP placeholders, plus hero, story, gallery, Open Graph and app icons. Every placeholder is a designed brand composition, not a grey box.
- **WhatsApp reservations**: server-validated request, rate limiting, calendar checks, a reference code and a pre-written WhatsApp message. No booking is stored on the server.
- **QR entry** at `/qr/origen`: records an anonymous scan and forwards to the menu with `utm_source=qr`.
- **Story and gallery pages** with an accessible lightbox.
- **SEO**: localized metadata, canonicals, `hreflang`, JSON-LD (`Restaurant`, `Menu`, `BreadcrumbList`), sitemap, robots and Open Graph images.
- **Privacy page** and a confirmation (`/gracias`) explaining what happens after the WhatsApp message is sent.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Route Handlers, `proxy.ts`) |
| UI | React 19, Tailwind CSS 4, CSS custom properties |
| Language | TypeScript, strict mode |
| Validation | Zod 4 (same schema on client and server) |
| Fonts | Cormorant Garamond + Manrope through `next/font` |
| Images | `next/image`, generated WebP assets with Sharp |
| Backend | Next.js Route Handlers on the Node.js runtime |
| Deployment | Vercel (free plan) |

No database, no ORM, no authentication service, no state library and no component kit.

---

## Quick start

Requirements: **Node.js 20.9+** and **pnpm 9+**.

```bash
pnpm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
pnpm dev
```

Open <http://localhost:3000>. `/` redirects to `/es`.

To check a production build locally:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm start
```

The generated images are committed, so `pnpm build` does not need Sharp or network access. Run `pnpm assets` only when the menu or the placeholder design changes.

---

## Environment variables

| Variable | Scope | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | yes in production | Canonical origin used by metadata, sitemap and Open Graph. Use `https://your-project.vercel.app` on Vercel. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | public | yes | Restaurant WhatsApp number, international format, digits only (for example `5355550100`). |
| `RESERVATION_IP_SALT` | server only | yes in production | Salt used to hash IP addresses for rate limiting and logs. Use a long random string. |

The defaults in `src/content/restaurant.ts` are **demo placeholders**. Replace the phone, WhatsApp number, address, email, social links and opening hours with the restaurant’s real data before launch.

---

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server. |
| `pnpm build` | Production build. |
| `pnpm start` | Serve the production build. |
| `pnpm lint` | ESLint with the Next.js core-web-vitals and TypeScript rules. |
| `pnpm typecheck` | `tsc --noEmit`. |
| `pnpm test` | Vitest unit tests. |
| `pnpm assets` | Regenerate dish, hero, story, gallery, OG and icon placeholders from `src/content/menu.json`. Requires Sharp (already a dev dependency). |

---

## Routes

| Route | Description | Indexable |
| --- | --- | --- |
| `/` | 308 redirect to `/es`. | — |
| `/es`, `/en` | Home: hero, signature dish, chef suggestions, recommendations, story, gallery, reservation CTA and contact. | ✅ |
| `/es/menu`, `/en/menu` | Full menu with search, category navigation and recommendations. | ✅ |
| `/es/historia`, `/en/historia` | Brand story, values and craft. | ✅ |
| `/es/galeria`, `/en/galeria` | Gallery with keyboard-accessible lightbox. | ✅ |
| `/es/reservar`, `/en/reservar` | Reservation form and WhatsApp handoff. | ✅ |
| `/es/gracias`, `/en/gracias` | “What happens next” after the request. | ❌ `noindex` |
| `/es/privacidad`, `/en/privacidad` | Privacy and cookies. | ✅ |
| `/qr/origen` | QR landing, records the scan, 307 redirect to `/es/menu?utm_source=qr`. | ❌ `noindex` |
| `/api/*` | Route handlers. | ❌ |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | Generated metadata routes. | — |

---

## API

All responses follow the same envelope:

```ts
type Ok<T> = { ok: true; data: T };
type Err = {
  ok: false;
  error: { code: string; message: string; fields?: Record<string, string> };
};
```

Error codes: `VALIDATION` (422), `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `INTERNAL` (500).

### `GET /api/menu`

Cached for 60 seconds with `stale-while-revalidate=300`.

```json
{
  "ok": true,
  "data": {
    "categories": [{ "id": "...", "slug": "cocteleria", "name": { "es": "...", "en": "..." } }],
    "updatedAt": "2026-10-25T00:00:00.000Z",
    "currency": "USD",
    "stats": { "categories": 8, "sections": 20, "dishes": 93, "priced": 92 }
  }
}
```

### `POST /api/reservations`

Request body (`.strict()`, maximum 8 KB):

```json
{
  "name": "Ana Pérez",
  "contact": "+53 5 555 0100",
  "partySize": 2,
  "date": "2026-11-07",
  "time": "20:00",
  "zone": "any",
  "notes": "",
  "locale": "es",
  "website": ""
}
```

`website` is a honeypot. `zone` is one of `any`, `salon`, `terraza`, `barra`. The server also checks the Havana calendar, opening days, the 90-day window and the slot grid.

Successful response (`201`):

```json
{
  "ok": true,
  "data": {
    "reference": "OR-7K2M4Q",
    "status": "pending",
    "whatsappUrl": "https://wa.me/5355550100?text=...",
    "message": "Hola, The Origen. Quiero reservar...",
    "summary": {
      "guestName": "Ana Pérez",
      "partySize": 2,
      "date": "2026-11-07",
      "time": "20:00",
      "zone": "any"
    }
  }
}
```

The booking is **not persisted**. The client opens WhatsApp with the prepared message; the restaurant receives it there. If WhatsApp is unavailable, the page still shows the reference and a copyable message.

### `POST /api/qr/scan`

Accepts `{ "slug": "origen", "channel": "table" | "poster" | "flyer" | "direct" }`. Returns `202` and never blocks the redirect.

### `GET /api/health`

Returns the environment, menu statistics and the in-memory QR snapshot. Useful for smoke tests, not for analytics.

### Rate limits

| Scope | Limit |
| --- | --- |
| Reservations per IP | 5 / hour |
| Reservations per contact hash | 3 / hour |
| QR scans per IP | 30 / minute |
| QR scans per slug | 60 / minute |

Limits are enforced by a sliding-window limiter in process memory. See [Known limitations](#known-limitations).

---

## How reservations work

1. The guest fills in name, phone/WhatsApp, party size (1–12), date, time, area and optional notes.
2. The client validates with the shared Zod schema and checks the selected day against the service calendar.
3. The server repeats every check, verifies the request origin, applies the honeypot and rate limits.
4. The server returns a reference, the WhatsApp deep link and the exact message.
5. The guest sends the message on WhatsApp. The restaurant confirms manually.
6. `/gracias` explains the three steps and offers a direct WhatsApp link as a fallback.

Opening hours, slot step (30 minutes), last seating and the 90-day window are configured in `src/content/restaurant.ts` and `src/domain/reservations/service-schedule.ts`.

---

## How the QR entry works

Point a physical QR code at:

```text
https://your-project.vercel.app/qr/origen?channel=table
```

The route records `{ slug, channel }`, a salted IP hash, a coarse user-agent family and a timestamp, then redirects to `/es/menu?utm_source=qr&utm_medium=table`. The counter is in memory and is intentionally anonymous: no cookies, no raw IPs, no fingerprinting.

Available channels: `table`, `poster`, `flyer`, `direct`.

---

## Project structure

```text
src/
├─ app/
│  ├─ [locale]/
│  │  ├─ layout.tsx          # header, footer, skip link
│  │  ├─ page.tsx            # home
│  │  ├─ menu/page.tsx
│  │  ├─ reservar/page.tsx
│  │  ├─ historia/page.tsx
│  │  ├─ galeria/page.tsx
│  │  ├─ privacidad/page.tsx
│  │  ├─ gracias/page.tsx
│  │  └─ not-found.tsx
│  ├─ api/{menu,reservations,qr/scan,health}/route.ts
│  ├─ qr/origen/route.ts
│  ├─ layout.tsx             # fonts, theme cookie, language attribute
│  ├─ globals.css            # tokens, typography, buttons, fields, arch motif
│  ├─ manifest.ts
│  ├─ robots.ts
│  ├─ sitemap.ts
│  └─ icon.svg
├─ components/
│  ├─ layout/                # header, navigation, footer, theme and locale switches
│  ├─ menu/                  # dish card, searchable menu explorer
│  ├─ reservations/          # reservation form and success state
│  ├─ gallery/               # gallery grid and dialog
│  ├─ seo/                   # JSON-LD script
│  └─ ui/                    # icons, section heading
├─ content/
│  ├─ menu.json              # source of truth for the menu
│  ├─ menu.ts                # Zod-validated document and catalog
│  ├─ restaurant.ts          # business data and service hours
│  ├─ media.ts               # media registry
│  └─ dictionaries/{es,en}.ts
├─ domain/
│  ├─ menu/                  # types, schema, catalog, money
│  └─ reservations/          # types, schema, service schedule
├─ lib/
│  ├─ format/                # date formatting
│  ├─ i18n/                  # locales, interpolation, route helper
│  ├─ seo/                   # metadata and JSON-LD factories
│  ├─ theme/                 # theme cookie helpers
│  ├─ utils/                 # class name helper
│  └─ whatsapp.ts            # deep-link builder
├─ server/
│  ├─ config/                # environment
│  ├─ core/                  # errors, logger
│  ├─ domain/                # menu, reservations, QR services
│  ├─ http/                  # response envelope, request context, body reader
│  └─ infrastructure/        # rate limiting, HMAC hashing
└─ proxy.ts                  # CSP nonce, security headers, locale header
```

Only `src/server/**` imports server-only configuration. The public menu, dictionaries and domain schemas are safe on both sides.

---

## Content and media

### Business data

Edit `src/content/restaurant.ts`: name, address, phone, WhatsApp, email, social links, coordinates, opening hours, reservation window and zones. The same file feeds the footer, contact section, JSON-LD and sitemap metadata.

### Menu

`src/content/menu.json` is validated at import time by `menu.schema.ts`. Each dish carries:

- localized `name` and `description`;
- a numeric `price` and `currency: "USD"` (or `null` for a non-priced note);
- `image` and localized `imageAlt`;
- `isRecommended`, `isNote` and `sortOrder`.

Add, edit or remove dishes there; pages and the API read the same document. No database migration is involved.

### Images

`src/content/media.ts` is the registry for hero, story, gallery and OG images. Every asset records its dimensions, alt text, owner, due date and status (`placeholder` → `received` → `optimized` → `live`).

The committed placeholders are generated from the menu:

```bash
pnpm assets
```

The script writes:

- `public/images/dishes/*.webp` — 800×600, one per dish;
- `public/images/hero-signature.webp` — 1400×1050;
- `public/images/story-room.webp` — 1200×900;
- `public/images/gallery-01..09.webp` — mixed 4:3 and 3:4;
- `public/og/es.jpg` and `public/og/en.jpg` — 1200×630;
- `src/app/apple-icon.png` — 180×180.

Replace a placeholder by dropping the final optimized file at the same path and keeping the same aspect ratio. No component changes are needed. The design uses the same arch motif and Cormorant typography, so the swap causes no layout shift.

---

## Data migration notes

The menu was migrated from the restaurant’s previous public menu and normalized:

- **8 categories** instead of 6: cocktails, beers, non-alcoholic drinks, starters, chef suggestions, main courses, desserts, coffee and digestifs.
- **Typos fixed** (`Berenjera` → `Berenjena`, inconsistent capitalization, duplicated translations).
- **Hidden items removed** (three items marked invisible in the source and three duplicated starters).
- **Placeholder descriptions replaced** where the source contained `"..."`.
- **12 recommended dishes** marked with the `Recomendado` tag.
- **Prices kept in USD** with the currency always visible (`$12.00 USD`).

Two things still require the restaurant’s confirmation:

1. **Prices and descriptions are the migrated source data.** They must be confirmed before launch.
2. **Three signature main-course descriptions were written editorially** to replace missing text. They should be reviewed by the kitchen before launch.
3. **Allergens and dietary tags are intentionally absent.** The source did not contain reliable data, and inventing it would be unsafe. Add them to `menu.json` and the UI when the restaurant supplies them.

---

## Security

- **Validation:** one Zod schema, `.strict()`, shared by browser and server; 8 KB body cap; control characters rejected in notes.
- **Origin checks:** `Origin` and `Sec-Fetch-Site` are verified on every mutation; no state changes on `GET`.
- **Rate limiting:** per IP and per contact hash, with `429` and `Retry-After`.
- **PII:** the server does not persist reservations. Logs contain the reference, party size, date/time/area and salted hashes — never the name or phone number. The full message lives only in the browser and in WhatsApp.
- **Headers:** strict CSP with a per-request nonce and `strict-dynamic`, HSTS, `nosniff`, `DENY`, `frame-ancestors 'none'`, restrictive `Permissions-Policy`, COOP/CORP.
- **Secrets:** only `RESERVATION_IP_SALT` is server-only. Nothing sensitive is prefixed with `NEXT_PUBLIC_`.
- **No admin surface:** there is no login, no admin route and no public write endpoint other than the validated reservation and QR handlers.

Before a production launch, set a long random `RESERVATION_IP_SALT`, replace the placeholder WhatsApp number and business data, and review the privacy text with the restaurant.

---

## Accessibility and performance

- Semantic landmarks, one `h1` per page, no skipped heading levels.
- Visible focus rings, keyboard-operable dialogs, skip link, labels tied to every field, errors linked with `aria-describedby` and `aria-invalid`.
- `aria-live` for search results and status messages.
- Touch targets of at least 44×44 px; 360 px layout tested.
- `prefers-reduced-motion` respected for scrolling, animations and transitions.
- Server-rendered menu content; client JavaScript limited to navigation, search, the gallery dialog and the reservation form.
- Local WebP images with explicit dimensions, lazy loading below the fold and `priority` only on the hero.
- No third-party scripts, analytics pixels or UI kits.

The hero and dish images are placeholders and therefore lighter than final photography. When real images arrive, keep the same dimensions and compress to the budgets in `AGENTS.md` (hero < 150 KB, fonts < 80 KB, initial JS < 120 KB gzip, LCP < 2.5 s on 3G, CLS < 0.1).

---

## Deployment on Vercel

1. Push the repository to GitHub (or import the local folder with the Vercel CLI).
2. Create a Vercel project with the **Next.js** preset. The free plan is enough.
3. Add the environment variables from [Environment variables](#environment-variables) for Production and Preview.
4. Set `NEXT_PUBLIC_SITE_URL` to the deployment URL (for example `https://the-origen-restaurant.vercel.app`).
5. Deploy. The build runs `next build`; no database or external service is required.

No custom domain is configured. The `.vercel.app` URL is used as the canonical origin until a domain is added.

For the QR code, generate it from the final deployment URL:

```text
https://<project>.vercel.app/qr/origen?channel=table
```

---

## Known limitations

- **No persistence.** Reservations exist only in the WhatsApp conversation. There is no booking history, no availability engine and no table assignment. This is deliberate for the demo; a production version would add a database and a staff panel.
- **In-memory rate limits and QR counters.** On Vercel they are per serverless instance and reset on redeploy or cold start. For reliable limits and analytics, move them to Redis or Postgres.
- **No admin panel.** Menu edits are code changes in `src/content/menu.json`, followed by a deploy.
- **Placeholder business data and images.** Replace them before launch; see [Content and media](#content-and-media).
- **Manual confirmation.** The site never claims a table is confirmed. The guest is told the team will confirm on WhatsApp the same day.
- **`/api/health` is public.** It exposes counts only, not personal data. Remove it or protect it if that is not acceptable.
- **No automated end-to-end suite.** Unit tests cover the domain primitives; a Playwright pass at 360 px and both locales is the next quality step.

---

## License

MIT. See [LICENSE](./LICENSE).
