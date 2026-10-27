import { notFound } from "next/navigation";
import type { Locale } from "@/domain/menu/menu.types";
import { isLocale } from "./config";

export interface LocaleRouteParams {
  readonly locale: string;
}

export const resolveLocale = async (
  params: Promise<LocaleRouteParams>,
): Promise<Locale> => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
};
