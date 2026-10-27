---
name: Frontend — The Origen
description: Next.js App Router frontend work for The Origen restaurant site. Use for pages, components, design system, theming, i18n ES/EN, menu UI, reservation forms, admin UI, accessibility and frontend performance.
---

# Frontend Skill — The Origen

Premium, bilingual restaurant site. Every screen must feel like the room: warm, dim, tactile, quietly expensive. Nothing generic, nothing template-like.

## Non-negotiables
1. **App Router + Server Components by default.** Add `"use client"` only when the component needs state, effects, or browser APIs.
2. **Mobile-first at 360 px.** That is the reference width, not 390 px.
3. **Dark theme is the default.** Light theme is cream, optional, persisted.
4. **ES and EN are first-class.** No hardcoded UI strings.
5. **Performance budget is a feature.** See the budget table; a beautiful page that fails LCP is a defect.
6. **WCAG 2.1 AA in both themes.** Not "we'll fix it later".

## Stack
- Next.js (App Router) · TypeScript strict · React Server Components
- Tailwind CSS with CSS variables for theme tokens
- `next/image`, `next/font`, `next-intl` (or equivalent dictionary approach) for ES/EN
- React Hook Form + shared Zod schemas (same schema used server-side)
- Framer Motion only for meaningful transitions
- Playwright for e2e at 360 px, Vitest + Testing Library for units

## Structure
```text
src/
├─ app/
│  ├─ [locale]/
│  │  ├─ layout.tsx          # fonts, theme, metadata base
│  │  ├─ page.tsx            # home / hero
│  │  ├─ menu/page.tsx       # digital menu (static + ISR)
│  │  ├─ historia/page.tsx   # story, team, craft
│  │  ├─ galeria/page.tsx    # gallery (dishes, cocktails, room)
│  │  ├─ reservar/page.tsx   # reservation form
│  │  ├─ gracias/page.tsx    # post-reservation + .ics
│  │  └─ qr/origen/page.tsx  # QR landing + scan counting
│  ├─ admin/                 # authenticated panel (owner/staff/developer)
│  ├─ api/                   # route handlers (Node runtime)
│  ├─ sitemap.ts robots.ts opengraph-image.tsx
│  └─ globals.css
├─ components/
│  ├─ ui/                    # primitives: Button, Field, Tag, Modal
│  ├─ menu/                  # MenuSearch, CategoryBar, DishCard
│  ├─ reservations/          # ReservationForm, TimeSlotPicker
│  └─ admin/                 # tables, editors, role gates
├─ lib/                      # i18n, theme, formatting, supabase clients
├─ server/                   # services, repositories, validation (see backend skill)
└─ content/                  # dictionaries es.ts / en.ts
```

## Design tokens
Define once in `globals.css`, consume through Tailwind.

```css
:root[data-theme="dark"] {
  --bg:            #14100D; /* warm near-black brown */
  --bg-elevated:   #1C1713;
  --surface:       #221C17;
  --border:        #342B23;
  --text:          #F4EDE4;
  --text-muted:    #B8A897;
  --gold:          #C9A227;
  --gold-soft:     #E0C878;
  --danger:        #E06C5A;
  --success:       #6FA97A;
}
:root[data-theme="light"] {
  --bg:            #FAF6EF; /* cream */
  --bg-elevated:   #FFFFFF;
  --surface:       #F3EDE3;
  --border:        #E2D8C9;
  --text:          #241C15;
  --text-muted:    #6B5C4D;
  --gold:          #9C7C1E; /* darker gold for AA contrast on cream */
  --gold-soft:     #B8901F;
}
```

Rules:
- **Contrast:** body text ≥ 4.5:1, large text ≥ 3:1, focus ring ≥ 3:1, in **both** themes.
- Gold is an accent: 1 px hairlines, icons, active states, small uppercase labels. Never large gold blocks.
- Neumorphism only on menu cards and primary buttons, and only soft: paired inner highlight + outer shadow. Never on inputs, never as decoration.
- Radii: 2 px for hairlines/details, 10–14 px for cards, full pill only for tags and the reserve button if it suits.
- Motion: 150–250 ms, ease-out. Respect `prefers-reduced-motion`.

## Typography
- Headings: **Cormorant Garamond** (400/500/600). Display sizes via `clamp()`.
- Body/UI: **Manrope** (400/500/600).
- Load with `next/font/google`, `display: "swap"`, subset `latin` + `latin-ext`, and preload only the two faces actually used above the fold.
- `letter-spacing` negative only for large display; small caps labels get tracking `0.12em`–`0.18em`.
- Line length 60–75 characters. Menu descriptions max ~2 lines on mobile.
- **Editorial style (ES):** sentence case everywhere; only the first word and proper nouns capitalized. No Title Case, no all-caps dish names. Same tone in EN; culturally accurate, not literal.

## Placeholder media (no assets yet)
- Placeholders are **designed**: warm texture built from `--bg`/`--surface`, the arch motif as a hairline, dish name in Cormorant. Never a gray box, never a stock photo, never "imagen próximamente".
- Use the exact aspect ratio and box of the final asset. Swapping must cause **zero CLS**.
- Read every path from `content/media.ts` (registry with owner, format, due date, status). Never hardcode the same image in five components.
- The hero placeholder still carries the headline and the "Reservar mesa" CTA; the message never depends on the image.
- If a real photo is missing, the dish card degrades to a typographic card — not to a broken icon.

## Component inventory expected
| Component | Notes |
|---|---|
| `SiteHeader` | Logo (SVG), ES/EN switch, theme switch, nav, reserve CTA. Sticky, shrinks on scroll. |
| `Hero` | One dominant idea: signature dish photo **or** vector illustration, headline, primary "Reservar mesa" + secondary "Ver el menú". Total hero media < 150 KB. |
| `CategoryBar` | Reliable active indicator, horizontal scroll with edge fade, keyboard reachable. Never two active items. |
| `MenuSearch` | Client-side filter over already-loaded menu data; debounced 150 ms; results announced via `aria-live="polite"`. |
| `DishCard` | Name + price on the same line (price right-aligned), description, `Recomendado` tag, dietary/allergen tags. Compact: aim 3–4 cards per 360 px viewport, never 330 px tall. |
| `SoldOutState` | Dish stays visible but desaturated, labelled "Agotado hoy" / "Sold out today", price muted, no add/reserve affordance. Never hide the item silently — it erodes trust. |
| `AddToCalendar` | `.ics` download on the confirmation screen; 44 px target; works on iOS and Android. |
| `StorySection` / `GalleryGrid` | Editorial layout, generous whitespace, real images when available, captions that carry meaning. Gallery lazy-loads everything below the fold. |
| `OfflineBanner` | Appears only when serving from cache: "Menú sin conexión · última actualización hace X". Never blocks reading. |
| `ReservationForm` | Name, contact, party size, date, time slot, notes. Inline validation, server errors mapped to fields, honeypot hidden, success → WhatsApp deep link. |
| `ThemeToggle` | Dark/light, persists in `localStorage` + cookie, no flash of wrong theme. |
| `LocaleSwitch` | Preserves current path, sets `NEXT_LOCALE`, announces change. |
| `AdminTable` | Server-driven pagination/sort/filter, optimistic updates, role-gated actions. |

## Theming without flash
- Read the theme cookie in the root layout (server) and set `data-theme` on `<html>`.
- Inline a tiny blocking script that reconciles `localStorage` **only** if it disagrees with the cookie.
- `theme-color` meta must follow the active theme (dark: `#14100D`, light: `#FAF6EF`).
- Never gate first paint on client JS.

## Data fetching rules
- Public menu is **static with ISR**: `export const revalidate = 60` (budget: < 1 min). Tag-based revalidation (`revalidateTag("menu")`) fires from admin mutations.
- No client-side waterfalls. Fetch on the server, pass minimal serializable props.
- Reservations and admin data are always dynamic and never cached.
- Loading states: skeletons that match final layout exactly (no layout shift). Errors: boundary per route segment with a human message and a retry.

## Offline menu (PWA)
Connectivity in Havana is unreliable; the menu must open anyway.

- Precache the menu shell, the menu JSON and the dish thumbnails (not the full gallery) with a versioned service worker.
- Strategy: **stale-while-revalidate** for menu data, **cache-first** for static assets, **network-only** for `/api/reservations`, `/api/admin/**` and `/admin/**`.
- Never cache a response that could contain personal data or an authenticated view.
- Show a quiet `OfflineBanner` with the last update time. Prices and availability may be stale: say so, do not pretend.
- Purge old caches on deploy (`CACHE_VERSION`); never let an old menu survive a price change indefinitely.
- The reservation form may open offline but must not submit: disable the button and explain that a connection is required.
- Verify: DevTools offline + cold start, and a real device in airplane mode.

## Forms
- One Zod schema per form in `src/server/validation/*`, imported by both client and server.
- Client validation = UX. Server validation = truth. Never skip the server pass.
- Disable submit while pending; keep values on error; never clear the form on failure.
- Success: show confirmation with the reservation reference and the WhatsApp button. Because confirmation is **manual**, the copy must say "Solicitud recibida — te confirmamos hoy", never "Reserva confirmada". Show the `.ics` link only once the status is `confirmed`.
- Expired/pending states must be explainable in one sentence; never leave the guest guessing whether the table is theirs.
- Honeypot field: visually hidden, `tabIndex={-1}`, `autoComplete="off"`, non-empty ⇒ silent success (do not reveal the trap).

## Accessibility checklist
- [ ] One `<h1>` per page; heading levels never skip.
- [ ] Landmarks: `header`, `nav`, `main`, `footer`.
- [ ] All interactive elements reachable by Tab, visible focus ring, logical order.
- [ ] Icon-only buttons have `aria-label`.
- [ ] Images: meaningful `alt`; decorative images `alt=""`.
- [ ] Form fields have real `<label>`, `aria-describedby` for errors, `aria-invalid`.
- [ ] Search results and toasts announced with `aria-live`.
- [ ] No keyboard trap in modals; Esc closes; focus returns.
- [ ] Text zoom to 200% without loss of content.
- [ ] Touch targets ≥ 44×44 px.
- [ ] `prefers-reduced-motion` respected.

## Performance budget (enforced in PR review)
| Metric | Budget |
|---|---|
| Hero media | < 150 KB (WebP/AVIF) |
| Initial JS | < 120 KB gzipped |
| Fonts | subset, < 80 KB total |
| LCP on 3G | < 2.5 s |
| Lighthouse | ≥ 90 (perf, a11y, SEO, best practices) |
| CLS | < 0.1 |

How:
- `next/image` with explicit `sizes`; `priority` only for the hero; everything else lazy.
- Import only the icon set actually used; no barrel imports of large libraries.
- Avoid client components in the menu path except search + category bar.
- No blocking third-party scripts. Analytics via `next/script` `afterInteractive`.
- Verify with `pnpm build && pnpm start` + Lighthouse mobile, not dev mode.

## Code conventions
- TypeScript `strict`; no `any`, no non-null `!` without a comment justifying it.
- Named exports for components; default export only for pages/layouts (Next.js requirement).
- File names kebab-case; component names PascalCase.
- Props typed explicitly; extend native element props when wrapping.
- Server/client boundary: keep `"use client"` at the leaf, not at page level.
- No inline hex colors in JSX; use tokens.
- Comments explain *why*, never *what*.
- Every component that can fail has an `error.tsx` or boundary at a sensible level.

## Definition of done
- [ ] Works at 360 px, 768 px, 1024 px, 1440 px.
- [ ] Both themes verified; no contrast regressions.
- [ ] ES and EN verified, no overflow from longer strings.
- [ ] Keyboard + screen reader pass.
- [ ] Lighthouse mobile ≥ 90 on a production build.
- [ ] No console errors/warnings.
- [ ] Budgets respected.
