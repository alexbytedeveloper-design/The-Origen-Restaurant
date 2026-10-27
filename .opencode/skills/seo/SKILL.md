---
name: SEO — The Origen
description: Technical and local SEO for The Origen bilingual restaurant site. Use for metadata, hreflang, structured data (Restaurant/Menu/MenuItem), sitemap, robots, Open Graph, Core Web Vitals, local SEO, keyword mapping and search measurement.
---

# SEO Skill — The Origen

Goal: when someone in Havana — or planning a trip to Havana — searches for a Cuban fine-dining restaurant, **The Origen appears first and looks like the obvious choice in the result.** Bilingual, rich, fast, and trustworthy.

## Objective & KPIs
| KPI | Target (first 6 months) |
|---|---|
| Ranking | Top 3 for branded terms, top 10 for "restaurante cubano La Habana", "fine dining Havana", "paladar La Habana" |
| Rich results | Restaurant + Menu eligible and error-free in Search Console |
| Core Web Vitals | All "Good" (LCP < 2.5 s, INP < 200 ms, CLS < 0.1) |
| Indexation | 100% of canonical URLs indexed, 0 duplicate/alternate-page errors |
| CTR | Above 4% for non-branded queries |

## URL & language architecture
- Locale-prefixed routes: `/es/...` and `/en/...`. `/` redirects (308) to `/es` — the primary market.
- Same slug shape in both languages; translate slugs only when the keyword genuinely differs, and always keep a redirect from the old slug.
- Canonicals are **self-referencing and absolute**: `https://theorigen.com/es/menu`.
- `hreflang` on every page, reciprocal:
  ```html
  <link rel="alternate" hreflang="es" href="https://theorigen.com/es/menu" />
  <link rel="alternate" hreflang="en" href="https://theorigen.com/en/menu" />
  <link rel="alternate" hreflang="x-default" href="https://theorigen.com/es/menu" />
  ```
- No `?lang=` parameters, no auto-redirect based on Accept-Language (it traps crawlers and users). Offer a visible ES/EN switch and remember the choice in a cookie.
- Trailing-slash policy: pick none, enforce with redirect, never both.

## Metadata (Next.js Metadata API)
One exported `metadata` (or `generateMetadata`) per route. Never duplicate titles/descriptions across pages or locales.

```ts
export const metadata: Metadata = {
  title: { default: "The Origen — Cocina cubana de autor en La Habana", template: "%s · The Origen" },
  description: "Restaurante de cocina cubana contemporánea en La Habana. Menú de autor, coctelería y reservas por WhatsApp.",
  alternates: { canonical: "/es", languages: { es: "/es", en: "/en", "x-default": "/es" } },
  openGraph: { type: "website", locale: "es_CU", alternateLocale: ["en_US"], siteName: "The Origen", images: ["/og/es.jpg"] },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
```

Per-page rules:
- **Title** 50–60 chars, primary keyword near the front, brand last. Unique per page and per locale.
- **Description** 140–160 chars, concrete, with a reason to click (dish, atmosphere, reservation). Not a keyword dump.
- One `<h1>` containing the page's primary intent.
- `theme-color` matches the active theme (dark `#14100D`, light `#FAF6EF`).
- `robots` meta only where needed; `noindex` for `/admin/**`, `/gracias`, and any staging domain.
- OG image per locale: 1200×630, < 300 KB, dish/room photo, logo, readable at thumbnail size. Generate with `ImageResponse` for menu items if volume justifies it.
- Staging/preview deployments must be `noindex` and behind auth or a `X-Robots-Tag: noindex` header.

## Structured data (JSON-LD)
Inject via `<script type="application/ld+json">` in the layout/page. Validate with the Rich Results Test.

Minimum: `Restaurant` on home (both locales).
```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://theorigen.com/#restaurant",
  "name": "The Origen",
  "description": "Cocina cubana de autor en La Habana.",
  "url": "https://theorigen.com/es",
  "image": ["https://theorigen.com/images/origen-hero.webp"],
  "servesCuisine": ["Cubana", "Contemporánea"],
  "priceRange": "$$$",
  "currenciesAccepted": "USD",
  "paymentAccepted": "Efectivo, Transferencia",
  "telephone": "+53...",
  "address": { "@type": "PostalAddress", "streetAddress": "...", "addressLocality": "La Habana", "addressCountry": "CU" },
  "geo": { "@type": "GeoCoordinates", "latitude": 0, "longitude": 0 },
  "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "12:00", "closes": "23:00" }],
  "acceptsReservations": "https://theorigen.com/es/reservar",
  "hasMenu": "https://theorigen.com/es/menu",
  "sameAs": ["https://www.instagram.com/...", "https://www.google.com/maps/place/..."]
}
```
Also:
- `Menu` + `MenuItem` on the menu page (`name`, `description`, `offers` with `price`, `priceCurrency: "USD"`, `eligibleDietaryRestriction` when tagged).
- `BreadcrumbList` on every nested page.
- `WebSite` with `inLanguage` and `potentialAction` (SearchAction) only if on-site search is public and crawlable.
- `Organization`/`LocalBusiness` only if it does not conflict with `Restaurant` — prefer one `Restaurant` node with `@id`.
- Keep one source of truth: build JSON-LD from the same data as the page. If the price changes in the DB, the markup must change with it. Never mark up dishes that are not visible.
- No fake reviews/ratings in markup. `aggregateRating` only with real, verifiable reviews.

## Technical SEO
- `app/sitemap.ts`: include all public localized routes, `lastModified` from content, `changefreq` honestly (menu weekly, home monthly). Exclude admin and thank-you pages.
- `app/robots.ts`: allow all public, disallow `/admin`, `/api`, `/gracias`; declare sitemap and host. Never block CSS/JS needed for rendering.
- Server-render all critical content. The menu must be in the initial HTML — no client-only fetch, no skeleton-only crawl.
- Semantic HTML: `header`, `nav`, `main`, `article` per dish, `footer`; headings in order.
- Descriptive internal links ("Ver el menú completo", not "clic aquí"), and a real link graph: home → menu → categories → dish anchors; home → reservations; menu → reservations.
- Stable URLs. Any change gets a 301. No chains, no loops.
- 404 for missing, 410 for permanently removed menu items. Never soft-404.
- Images: descriptive filenames (`ropa-vieja-origen.webp`), `alt` that describes the dish, `next/image` with width/height, AVIF/WebP.
- No duplicate content between ES and EN: translate, do not machine-dump. Each locale targets its own intent.
- Avoid thin pages: no empty category pages, no paginated duplicates without canonical.

## Local SEO (decisive for a restaurant)
- **Google Business Profile**: claim, verify, exact NAP (name, address, phone) matching the site footer and JSON-LD character-for-character.
- Categories: primary "Cuban restaurant", secondary "Fine dining restaurant", "Cocktail bar" if applicable.
- Hours match `openingHoursSpecification`. Update for holidays.
- 10+ real photos, menu link to `/es/menu`, reservation link to `/es/reservar`.
- Reviews: ask at the table via QR/WhatsApp after service; reply to every review. Never buy reviews.
- Citations: TripAdvisor, Yelp, Apple Maps, Bing Places, local directories — same NAP everywhere.
- Embedded map on the contact section (lazy-loaded, `loading="lazy"`, no layout shift, privacy-friendly).

## Keyword map (starting point, validate with real data)
| Page | ES intent | EN intent |
|---|---|---|
| Home | restaurante cubano La Habana, cocina de autor La Habana | Cuban fine dining Havana, best restaurant Havana |
| Menu | menú restaurante La Habana, precios, platos cubanos | Havana restaurant menu, Cuban dishes, prices |
| Story | historia restaurante La Habana, chef cubano | Cuban restaurant story Havana, chef |
| Gallery | fotos restaurante La Habana, ambiente | Havana restaurant photos, interior |
| Reservations | reservar mesa La Habana, reservas restaurante | book a table Havana, restaurant reservation Havana |
| QR | menú digital QR | digital menu QR |
Long-tail to cover in dish descriptions and category intros: "ropa vieja", "coctelería de autor La Habana", "cena romántica La Habana", "restaurante para turistas La Habana".

Map one primary keyword + 2–3 secondary per URL. No cannibalization: one page owns one intent.

## Content rules (SEO + brand)
- Each dish description: 1–2 sentences, sensory, specific, no clichés, no keyword stuffing. Unique — never duplicated across dishes.
- Category intros: 40–80 words, contextual, mention the cuisine naturally.
- English is written for English speakers, not translated word-for-word. Cultural references explained briefly.
- Fix the current site's errors before migration: "Berenjera" → "Berenjena", consistent sentence case, no "..." placeholders.
- Prices in USD, visible as `$12.00 USD`, consistent across menu, JSON-LD and OG.

## Core Web Vitals as ranking signal
- LCP: hero image preloaded, `fetchpriority="high"`, AVIF/WebP, correct `sizes`.
- INP: minimal client JS on the menu path; search debounced; no heavy hydration of the whole menu.
- CLS: reserved dimensions for every image, font `display: swap` with matched fallback metrics, no injected banners.
- Fonts subset and preloaded; no FOIT.
- Third-party scripts deferred; analytics after interactive.

## Measurement & iteration
- **Google Search Console** verified for both locales; submit sitemap; monitor Coverage, Enhancements, CWV.
- **Bing Webmaster Tools** + IndexNow for fast discovery of menu changes.
- Privacy-friendly analytics (or GA4 with consent): track `reservation_submit`, `whatsapp_click`, `menu_search`, `qr_scan`, `locale_switch`.
- Baseline + monthly report: impressions, clicks, CTR, position, top queries per locale, indexed pages, CWV status, rich result errors.
- Alert if indexation drops, a canonical breaks, or CWV leaves "Good".

## Pre-launch SEO checklist
- [ ] Unique title + description per page and per locale.
- [ ] Self-referencing absolute canonical on every page.
- [ ] Reciprocal `hreflang` + `x-default`.
- [ ] Sitemap generated and submitted; robots correct.
- [ ] `Restaurant` + `Menu`/`MenuItem` + `BreadcrumbList` valid, zero errors.
- [ ] OG/Twitter images render correctly when shared (test on WhatsApp + X + Facebook).
- [ ] Menu content present in server-rendered HTML (view-source test).
- [ ] 301 map from the old site's URLs; no redirect chains.
- [ ] 404/410 correct; no soft-404.
- [ ] `noindex` on admin, thank-you, preview deployments.
- [ ] NAP consistent across site, JSON-LD, GBP, TripAdvisor.
- [ ] Pages pass Lighthouse SEO ≥ 90 and CWV "Good" on mobile.
- [ ] English content reviewed by a human, not raw machine translation.
