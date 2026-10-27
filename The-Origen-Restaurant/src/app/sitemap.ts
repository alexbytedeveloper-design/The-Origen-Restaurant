import type { MetadataRoute } from "next";
import { MENU_DOCUMENT } from "@/content/menu";
import { LOCALES } from "@/lib/i18n/config";
import { Environment } from "@/server/config/environment";

const ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/menu", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/reservar", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/historia", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/galeria", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = Environment.siteUrl;
  const lastModified = new Date(MENU_DOCUMENT.updatedAt);

  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${base}/${locale}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          es: `${base}/es${route.path}`,
          en: `${base}/en${route.path}`,
          "x-default": `${base}/es${route.path}`,
        },
      },
    })),
  );
}
