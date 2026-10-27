import type { Locale } from "@/domain/menu/menu.types";
import { en } from "./en";
import { es } from "./es";

export type Dictionary = typeof es;

const DICTIONARIES: Record<Locale, Dictionary> = { es, en };

export const getDictionary = (locale: Locale): Dictionary => DICTIONARIES[locale];
