import Link from "next/link";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import { HeaderNavigation } from "@/components/layout/header-navigation";
import { RESTAURANT } from "@/content/restaurant";
import type { Dictionary } from "@/content/dictionaries";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Theme } from "@/lib/theme/theme";

interface SiteHeaderProps {
  readonly locale: Locale;
  readonly theme: Theme;
  readonly dictionary: Dictionary;
}

export function SiteHeader({ locale, theme, dictionary }: SiteHeaderProps) {
  return (
    <header className="site-header sticky top-0 z-40">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent"
      />
      <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          href={localePath(locale)}
          aria-label={`${RESTAURANT.name} — ${RESTAURANT.city}`}
          className="shrink-0 transition-opacity hover:opacity-90"
        >
          <BrandWordmark locale={locale} />
        </Link>

        <HeaderNavigation
          locale={locale}
          theme={theme}
          copy={{
            nav: dictionary.nav,
            header: dictionary.header,
            common: dictionary.common,
          }}
        />
      </div>
    </header>
  );
}
