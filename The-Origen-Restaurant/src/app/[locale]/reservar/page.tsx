import type { Metadata } from "next";
import { ReservationForm } from "@/components/reservations/reservation-form";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/content/dictionaries";
import { RESTAURANT } from "@/content/restaurant";
import { resolveLocale } from "@/lib/i18n/page";
import { JsonLdFactory } from "@/lib/seo/json-ld";
import { MetadataFactory } from "@/lib/seo/metadata";
import { Environment } from "@/server/config/environment";
import { HavanaClock } from "@/server/domain/reservations/havana-clock";

interface ReservationPageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

export async function generateMetadata({ params }: ReservationPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  return MetadataFactory.build({
    locale,
    title: dictionary.meta.reservation.title,
    description: dictionary.meta.reservation.description,
    path: "/reservar",
  });
}

export default async function ReservationPage({ params }: ReservationPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const copy = dictionary.reservation;

  const clock = new HavanaClock();
  const today = clock.today();
  const maxDate = clock.addDays(today, RESTAURANT.reservation.maxDaysAhead);

  return (
    <>
      <JsonLd
        data={JsonLdFactory.breadcrumbs(locale, [
          { name: dictionary.nav.home, path: "" },
          { name: dictionary.common.reserve, path: "/reservar" },
        ])}
      />

      <section className="border-b border-border/50">
        <div className="container-page pb-8 pt-10 lg:pb-10 lg:pt-14">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="display-1 mt-4">{copy.title}</h1>
          <p className="lead mt-4">{copy.lead}</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-page">
          <ReservationForm
            locale={locale}
            copy={copy}
            common={dictionary.common}
            today={today}
            maxDate={maxDate}
            serviceDays={RESTAURANT.serviceDays}
            stepMinutes={RESTAURANT.reservation.slotStepMinutes}
            whatsappNumber={Environment.whatsappNumber}
          />
        </div>
      </section>
    </>
  );
}
