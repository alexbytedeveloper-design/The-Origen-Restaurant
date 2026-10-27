import type { Locale } from "@/domain/menu/menu.types";

export const LOCALES = ["es", "en"] as const;
export const DEFAULT_LOCALE: Locale = "es";

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

export const otherLocale = (locale: Locale): Locale => (locale === "es" ? "en" : "es");

export const localePath = (locale: Locale, path = ""): string =>
  `/${locale}${path.startsWith("/") ? path : path ? `/${path}` : ""}`;

export const localeLabel = (locale: Locale): string => (locale === "es" ? "ES" : "EN");

export const htmlLang = (locale: Locale): string => (locale === "es" ? "es-CU" : "en");
