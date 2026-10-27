import { RESTAURANT } from "@/content/restaurant";
import type { Locale, MenuDocument } from "@/domain/menu/menu.types";
import { Environment } from "@/server/config/environment";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export interface BreadcrumbItem {
  readonly name: string;
  readonly path: string;
}

export class JsonLdFactory {
  public static restaurant(locale: Locale): Record<string, unknown> {
    const base = Environment.siteUrl;

    return {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "@id": `${base}/#restaurant`,
      name: RESTAURANT.name,
      legalName: RESTAURANT.legalName,
      url: `${base}/${locale}`,
      image: [`${base}/images/hero-signature.webp`],
      logo: `${base}/icon.svg`,
      telephone: RESTAURANT.phone,
      email: RESTAURANT.email,
      priceRange: RESTAURANT.priceRange,
      servesCuisine: RESTAURANT.cuisines,
      currenciesAccepted: "USD",
      paymentAccepted: "Cash, Credit Card",
      smokingAllowed: false,
      acceptsReservations: `${base}/${locale}/reservar`,
      hasMenu: `${base}/${locale}/menu`,
      address: {
        "@type": "PostalAddress",
        streetAddress: RESTAURANT.address.street,
        addressLocality: RESTAURANT.address.locality,
        addressRegion: RESTAURANT.address.region,
        postalCode: RESTAURANT.address.postalCode,
        addressCountry: RESTAURANT.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: RESTAURANT.geo.latitude,
        longitude: RESTAURANT.geo.longitude,
      },
      hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${RESTAURANT.name}, ${RESTAURANT.address.street}, ${RESTAURANT.city}`,
      )}`,
      sameAs: [RESTAURANT.social.instagram, RESTAURANT.social.facebook],
      openingHoursSpecification: RESTAURANT.serviceDays
        .filter((day) => !day.closed)
        .map((day) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: DAY_NAMES[day.weekday],
          opens: day.opens,
          closes: day.closes,
        })),
    };
  }

  public static menu(document: MenuDocument, locale: Locale): Record<string, unknown> {
    const base = Environment.siteUrl;

    return {
      "@context": "https://schema.org",
      "@type": "Menu",
      "@id": `${base}/${locale}/menu#menu`,
      name: locale === "es" ? `Menú de ${RESTAURANT.name}` : `${RESTAURANT.name} menu`,
      inLanguage: locale === "es" ? "es-CU" : "en",
      url: `${base}/${locale}/menu`,
      hasMenuSection: document.categories.map((category) => ({
        "@type": "MenuSection",
        name: category.name[locale],
        description: category.tagline[locale],
        hasMenuItem: category.sections
          .flatMap((section) => section.dishes)
          .filter((dish) => !dish.isNote && dish.price !== null)
          .map((dish) => ({
            "@type": "MenuItem",
            name: dish.name[locale],
            description: dish.description[locale],
            offers: {
              "@type": "Offer",
              price: dish.price?.toFixed(2),
              priceCurrency: "USD",
            },
          })),
      })),
    };
  }

  public static breadcrumbs(
    locale: Locale,
    items: readonly BreadcrumbItem[],
  ): Record<string, unknown> {
    const base = Environment.siteUrl;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${base}/${locale}${item.path}`,
      })),
    };
  }
}
