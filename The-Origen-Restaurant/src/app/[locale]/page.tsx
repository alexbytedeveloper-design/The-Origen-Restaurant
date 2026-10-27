import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DishCard } from "@/components/menu/dish-card";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ArrowRightIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { ArchWatermark, BrassCorners, DiamondMark, OrnamentDivider, SectionNumber } from "@/components/ui/ornament";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/content/dictionaries";
import { GALLERY_MEDIA, HERO_MEDIA, STORY_MEDIA } from "@/content/media";
import { MENU_CATALOG } from "@/content/menu";
import { RESTAURANT } from "@/content/restaurant";
import { Money } from "@/domain/menu/money";
import type { OpeningDay } from "@/domain/reservations/service-schedule";
import { formatWeekday } from "@/lib/format/date";
import { localePath } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/page";
import { JsonLdFactory } from "@/lib/seo/json-ld";
import { MetadataFactory } from "@/lib/seo/metadata";
import { buildWhatsAppUrl, DIRECT_WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { Environment } from "@/server/config/environment";

interface HomePageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  return MetadataFactory.build({
    locale,
    title: dictionary.meta.home.title,
    description: dictionary.meta.home.description,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const copy = dictionary.home;
  const labels = { recommended: dictionary.common.recommended, note: dictionary.common.note };

  const signature = MENU_CATALOG.findDish("el-consentido-origen") ?? MENU_CATALOG.recommended[0];
  if (!signature) notFound();

  const chefDishes =
    MENU_CATALOG.findCategory("sugerencias-del-chef")
      ?.sections.flatMap((section) => section.dishes)
      .filter((dish) => !dish.isNote)
      .slice(0, 2) ?? [];

  const excluded = new Set([signature.id, ...chefDishes.map((dish) => dish.id)]);
  const recommended = MENU_CATALOG.recommended
    .filter((dish) => !excluded.has(dish.id))
    .slice(0, 6);

  const galleryImages = GALLERY_MEDIA.filter((asset) => asset.width > asset.height).slice(0, 4);

  const reservationHref = localePath(locale, "/reservar");
  const menuHref = localePath(locale, "/menu");
  const galleryHref = localePath(locale, "/galeria");
  const historyHref = localePath(locale, "/historia");

  const whatsappUrl = buildWhatsAppUrl(
    Environment.whatsappNumber,
    DIRECT_WHATSAPP_MESSAGES[locale],
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${RESTAURANT.name}, ${RESTAURANT.address.street}, ${RESTAURANT.city}`,
  )}`;
  const phoneHref = `tel:${RESTAURANT.phone.replace(/[^\d+]/g, "")}`;
  const openDays = RESTAURANT.serviceDays.filter(
    (day): day is Extract<OpeningDay, { readonly closed: false }> => !day.closed,
  );
  const firstOpen = openDays[0];
  const lastOpen = openDays[openDays.length - 1];
  const hoursLabel =
    firstOpen && lastOpen
      ? `${formatWeekday(firstOpen.weekday, locale)} – ${formatWeekday(lastOpen.weekday, locale)} · ${firstOpen.opens} – ${firstOpen.lastSeating}`
      : "";

  return (
    <>
      <JsonLd data={JsonLdFactory.restaurant(locale)} />
      <JsonLd
        data={JsonLdFactory.breadcrumbs(locale, [
          { name: dictionary.nav.home, path: "" },
        ])}
      />

      <section className="hero-room relative overflow-hidden pb-20 pt-12 lg:pb-28 lg:pt-20">
        <div aria-hidden className="hero-arch" />
        <div aria-hidden className="ambient-candle absolute inset-x-0 top-0 h-[420px]" />
        <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="animate-rise relative">
            <span aria-hidden className="vertical-label absolute -left-6 top-6 hidden xl:block">
              VEDADO · LA HABANA
            </span>
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1 className="display-ornate display-xl mt-5">
              {copy.hero.title.lead}
              <br />
              <span className="foil-text italic">{copy.hero.title.accent}</span>
            </h1>
            <p className="lead mt-6 max-w-xl">{copy.hero.lead}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={reservationHref} className="btn btn-primary">
                {dictionary.common.reserve}
                <ArrowRightIcon />
              </Link>
              <Link href={menuHref} className="btn btn-secondary">
                {dictionary.common.viewMenu}
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="success-seal">
                <ArrowRightIcon className="h-4 w-4" />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                {copy.hero.note}
              </p>
            </div>
          </div>

          <div className="animate-rise-slow relative mx-auto w-full max-w-[440px]">
            <div className="plate-frame">
              <div className="plate-image relative aspect-square w-full">
                <Image
                  src={HERO_MEDIA.src}
                  alt={HERO_MEDIA.alt[locale]}
                  width={HERO_MEDIA.width}
                  height={HERO_MEDIA.height}
                  priority
                  sizes="(max-width: 1024px) 80vw, 440px"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="plaque stitched absolute -bottom-10 left-1/2 w-[min(340px,86vw)] -translate-x-1/2 px-6 py-4 text-center">
              <BrassCorners />
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-gold">
                {copy.hero.signature}
              </p>
              <p className="mt-1 font-display text-2xl leading-tight">{signature.name[locale]}</p>
              {signature.price !== null ? (
                <p className="mt-1 text-sm font-semibold text-gold-soft">
                  {Money.fromAmount(signature.price).format()}
                </p>
              ) : null}
            </div>

            <div className="seal absolute -right-4 top-10 hidden sm:flex">
              <span>
                Vedado
                <br />
                Estd
                <br />
                {RESTAURANT.established}
              </span>
            </div>
          </div>
        </div>

        <div className="hero-bottom-band mt-16 py-4">
          <div className="container-page press-band">
            <span>Producto de mercado</span>
            <DiamondMark />
            <span>Fuego lento</span>
            <DiamondMark />
            <span>Coctelería de autor</span>
            <DiamondMark />
            <span>Mesa sin prisa</span>
            <DiamondMark />
            <span>La Habana</span>
          </div>
        </div>
      </section>

      <section className="section-tight relative overflow-hidden">
        <ArchWatermark className="absolute -right-10 top-10 hidden h-[420px] w-[200px] rotate-6 lg:block" />
        <div className="container-page relative">
          <OrnamentDivider className="mx-auto mb-10 max-w-xl" />
          <p className="eyebrow">{copy.pillars.eyebrow}</p>
          <h2 className="display-2 mt-4 max-w-3xl">{copy.pillars.title}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {copy.pillars.items.map((item, index) => (
              <article key={item.title} className="card-physical stitched relative p-6">
                <BrassCorners />
                <SectionNumber value={`0${index + 1}`} />
                <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow={copy.chef.eyebrow}
            title={copy.chef.title}
            lead={copy.chef.lead}
            cta={{ href: menuHref, label: copy.chef.cta }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {chefDishes.map((dish, index) => (
              <DishCard
                key={dish.id}
                dish={dish}
                locale={locale}
                labels={labels}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border/50 bg-elevated/20">
        <div className="container-page">
          <SectionHeading
            eyebrow={copy.recommended.eyebrow}
            title={copy.recommended.title}
            lead={copy.recommended.lead}
            cta={{ href: menuHref, label: copy.recommended.cta }}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((dish) => (
              <DishCard key={dish.id} dish={dish} locale={locale} labels={labels} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div aria-hidden className="arch-outline absolute -inset-3 opacity-40" />
            <div className="arch overflow-hidden border border-border/60 bg-surface">
              <Image
                src={STORY_MEDIA.src}
                alt={STORY_MEDIA.alt[locale]}
                width={STORY_MEDIA.width}
                height={STORY_MEDIA.height}
                sizes="(max-width: 1024px) 92vw, 560px"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="eyebrow">{copy.story.eyebrow}</p>
            <h2 className="display-2 mt-4">{copy.story.title}</h2>
            <p className="lead mt-4">{copy.story.lead}</p>
            <blockquote className="mt-6 border-l border-gold/60 pl-5 font-display text-2xl italic leading-snug text-gold-soft">
              “{copy.story.quote}”
            </blockquote>
            <Link href={historyHref} className="link-arrow mt-6">
              {copy.story.cta}
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-t border-border/50 bg-elevated/20">
        <div className="container-page">
          <SectionHeading
            eyebrow={copy.gallery.eyebrow}
            title={copy.gallery.title}
            lead={copy.gallery.lead}
            cta={{ href: galleryHref, label: copy.gallery.cta }}
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {galleryImages.map((asset) => (
              <Link
                key={asset.id}
                href={galleryHref}
                className="group relative overflow-hidden rounded-xl border border-border/60 bg-surface"
              >
                <Image
                  src={asset.src}
                  alt={asset.alt[locale]}
                  width={asset.width}
                  height={asset.height}
                  sizes="(max-width: 640px) 50vw, 25vw"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-surface/60 px-6 py-14 text-center sm:px-12">
            <div
              aria-hidden
              className="arch-outline absolute left-1/2 top-1/2 h-[135%] w-[70%] -translate-x-1/2 -translate-y-1/2 opacity-20"
            />
            <div className="relative">
              <p className="eyebrow">{copy.reserve.eyebrow}</p>
              <h2 className="display-1 mt-4">{copy.reserve.title}</h2>
              <p className="lead mx-auto mt-4">{copy.reserve.lead}</p>
              <Link href={reservationHref} className="btn btn-primary mt-8">
                {copy.reserve.cta}
                <ArrowRightIcon />
              </Link>
              <p className="mt-4 text-xs text-muted">{copy.reserve.note}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight border-t border-border/50 bg-elevated/25">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">{copy.visit.eyebrow}</p>
            <h2 className="display-2 mt-4">{copy.visit.title}</h2>
            <Link href={mapsUrl} target="_blank" rel="noopener noreferrer" className="link-arrow mt-6">
              {copy.visit.directions}
              <ArrowRightIcon />
            </Link>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-bg/40 p-5">
              <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                <MapPinIcon />
                {copy.visit.address}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                {RESTAURANT.address.street}
                <br />
                {RESTAURANT.address.locality}, {RESTAURANT.country}
              </dd>
            </div>

            <div className="rounded-2xl border border-border/60 bg-bg/40 p-5">
              <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                <PhoneIcon />
                {copy.visit.phone}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                <a href={phoneHref} className="transition-colors hover:text-text">
                  {RESTAURANT.phone}
                </a>
              </dd>
            </div>

            <div className="rounded-2xl border border-border/60 bg-bg/40 p-5">
              <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                <ClockIcon />
                {copy.visit.hours}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                {hoursLabel}
                <br />
                {dictionary.reservation.aside.hoursNote}
              </dd>
            </div>

            <div className="rounded-2xl border border-border/60 bg-bg/40 p-5">
              <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </dt>
              <dd className="mt-2 text-sm leading-relaxed">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-soft transition-colors hover:text-gold"
                >
                  {copy.visit.whatsapp}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
