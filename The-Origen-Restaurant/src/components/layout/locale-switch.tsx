"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabel, otherLocale, type Locale } from "@/lib/i18n/config";

interface LocaleSwitchProps {
  readonly locale: Locale;
  readonly label: string;
  readonly variant?: "inline" | "button";
}

export function LocaleSwitch({ locale, label, variant = "inline" }: LocaleSwitchProps) {
  const pathname = usePathname();
  const targetLocale = otherLocale(locale);
  const href = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${targetLocale}`);

  return (
    <Link
      href={href}
      hrefLang={targetLocale}
      aria-label={`${label}: ${targetLocale === "es" ? "Español" : "English"}`}
      className={
        variant === "button"
          ? "inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-border/70 px-3 text-[11px] font-bold tracking-[0.16em] text-muted transition-colors hover:border-gold/60 hover:text-gold-soft"
          : "text-[11px] font-bold tracking-[0.18em] text-muted transition-colors hover:text-gold-soft"
      }
    >
      {localeLabel(targetLocale)}
    </Link>
  );
}
