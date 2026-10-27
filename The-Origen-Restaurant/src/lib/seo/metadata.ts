import type { Metadata } from "next";
import { RESTAURANT } from "@/content/restaurant";
import type { Locale } from "@/domain/menu/menu.types";
import { Environment } from "@/server/config/environment";

export interface PageMetadataInput {
  readonly locale: Locale;
  readonly title: string;
  readonly description: string;
  readonly path?: string;
  readonly imagePath?: string;
  readonly noIndex?: boolean;
}

export class MetadataFactory {
  public static build(input: PageMetadataInput): Metadata {
    const base = Environment.siteUrl;
    const path = input.path ?? "";
    const canonical = `${base}/${input.locale}${path}`;
    const image = `${base}${input.imagePath ?? `/og/${input.locale}.jpg`}`;

    return {
      metadataBase: new URL(base),
      title: input.title,
      description: input.description,
      applicationName: RESTAURANT.name,
      alternates: {
        canonical,
        languages: {
          es: `${base}/es${path}`,
          en: `${base}/en${path}`,
          "x-default": `${base}/es${path}`,
        },
      },
      openGraph: {
        type: "website",
        siteName: RESTAURANT.name,
        locale: input.locale === "es" ? "es_CU" : "en_US",
        alternateLocale: input.locale === "es" ? ["en_US"] : ["es_CU"],
        title: input.title,
        description: input.description,
        url: canonical,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: `${RESTAURANT.name} — ${RESTAURANT.city}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: input.title,
        description: input.description,
        images: [image],
      },
      robots: input.noIndex
        ? { index: false, follow: false }
        : { index: true, follow: true },
    };
  }
}
