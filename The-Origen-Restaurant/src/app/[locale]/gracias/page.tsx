import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, WhatsAppIcon } from "@/components/ui/icons";
import { getDictionary } from "@/content/dictionaries";
import { localePath } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/page";
import { MetadataFactory } from "@/lib/seo/metadata";
import { buildWhatsAppUrl, DIRECT_WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { Environment } from "@/server/config/environment";

interface ThanksPageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

export async function generateMetadata({ params }: ThanksPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  return MetadataFactory.build({
    locale,
    title: dictionary.meta.thanks.title,
    description: dictionary.meta.thanks.description,
    path: "/gracias",
    noIndex: true,
  });
}

export default async function ThanksPage({ params }: ThanksPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const copy = dictionary.thanks;
  const whatsappUrl = buildWhatsAppUrl(
    Environment.whatsappNumber,
    DIRECT_WHATSAPP_MESSAGES[locale],
  );

  return (
    <section className="section-tight">
      <div className="container-page max-w-3xl">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckIcon className="h-6 w-6" />
        </span>
        <p className="eyebrow mt-6">{copy.eyebrow}</p>
        <h1 className="display-1 mt-4">{copy.title}</h1>
        <p className="lead mt-4">{copy.lead}</p>

        <ol className="mt-10 space-y-4">
          {copy.steps.map((step, index) => (
            <li key={step.title} className="card-soft flex gap-4 p-5 sm:p-6">
              <span
                aria-hidden
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 text-[11px] font-bold text-gold"
              >
                0{index + 1}
              </span>
              <div>
                <h2 className="font-display text-2xl">{step.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/5 p-6">
          <h2 className="font-display text-2xl">{copy.whatsappTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{copy.whatsappText}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-4"
          >
            <WhatsAppIcon />
            {copy.whatsappCta}
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={localePath(locale)} className="btn btn-secondary">
            {copy.cta}
          </Link>
          <Link href={localePath(locale, "/menu")} className="btn btn-ghost">
            {copy.back}
          </Link>
        </div>
      </div>
    </section>
  );
}
