import Link from "next/link";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import {
  FacebookIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { RESTAURANT } from "@/content/restaurant";
import type { Dictionary } from "@/content/dictionaries";
import { formatWeekday } from "@/lib/format/date";
import { localePath, type Locale } from "@/lib/i18n/config";
import { buildWhatsAppUrl, DIRECT_WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { Environment } from "@/server/config/environment";

interface SiteFooterProps {
  readonly locale: Locale;
  readonly dictionary: Dictionary;
}

const WEEK_ORDER: readonly number[] = [1, 2, 3, 4, 5, 6, 0];

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const copy = dictionary.footer;
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl(
    Environment.whatsappNumber,
    DIRECT_WHATSAPP_MESSAGES[locale],
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${RESTAURANT.name}, ${RESTAURANT.address.street}, ${RESTAURANT.city}`,
  )}`;
  const phoneHref = `tel:${RESTAURANT.phone.replace(/[^\d+]/g, "")}`;

  const navItems = [
    { href: localePath(locale), label: dictionary.nav.home },
    { href: localePath(locale, "/menu"), label: dictionary.nav.menu },
    { href: localePath(locale, "/historia"), label: dictionary.nav.history },
    { href: localePath(locale, "/galeria"), label: dictionary.nav.gallery },
    { href: localePath(locale, "/reservar"), label: dictionary.common.reserve },
  ];

  const orderedDays = [...RESTAURANT.serviceDays].sort(
    (left, right) => WEEK_ORDER.indexOf(left.weekday) - WEEK_ORDER.indexOf(right.weekday),
  );

  return (
    <footer className="border-t border-border/60 bg-elevated/35">
      <div className="container-page py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr_1fr_1fr]">
          <div>
            <BrandWordmark locale={locale} size="lg" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">{copy.tagline}</p>

            <div className="mt-6 flex items-center gap-2">
              <a
                href={RESTAURANT.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-muted transition-colors hover:border-gold/60 hover:text-gold-soft"
              >
                <InstagramIcon />
              </a>
              <a
                href={RESTAURANT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-muted transition-colors hover:border-gold/60 hover:text-gold-soft"
              >
                <FacebookIcon />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={copy.whatsapp}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-muted transition-colors hover:border-gold/60 hover:text-gold-soft"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
              {copy.explore}
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
              {copy.contact}
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-muted">
              <li>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2.5 transition-colors hover:text-text"
                >
                  <MapPinIcon className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    {RESTAURANT.address.street}
                    <br />
                    {RESTAURANT.address.locality}, {RESTAURANT.country}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={phoneHref}
                  className="flex items-center gap-2.5 transition-colors hover:text-text"
                >
                  <PhoneIcon className="shrink-0 text-gold" />
                  {RESTAURANT.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${RESTAURANT.email}`}
                  className="transition-colors hover:text-text"
                >
                  {RESTAURANT.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-gold-soft transition-colors hover:text-gold"
                >
                  <WhatsAppIcon />
                  {copy.whatsapp}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
              {copy.hours}
            </h2>
            <ul className="mt-5 space-y-2 text-sm">
              {orderedDays.map((day) => (
                <li
                  key={day.weekday}
                  className="flex items-baseline justify-between gap-3 border-b border-border/40 pb-2 last:border-0"
                >
                  <span className="capitalize text-muted">
                    {formatWeekday(day.weekday, locale)}
                  </span>
                  <span className={day.closed ? "text-muted" : "text-text"}>
                    {day.closed ? copy.closed : `${day.opens} – ${day.closes}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {RESTAURANT.name}. {copy.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href={localePath(locale, "/privacidad")}
              className="transition-colors hover:text-text"
            >
              {copy.privacy}
            </Link>
            <span>{copy.madeIn}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
