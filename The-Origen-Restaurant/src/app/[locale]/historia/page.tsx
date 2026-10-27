import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/content/dictionaries";
import { STORY_MEDIA } from "@/content/media";
import { localePath } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/page";
import { JsonLdFactory } from "@/lib/seo/json-ld";
import { MetadataFactory } from "@/lib/seo/metadata";

interface HistoryPageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

export async function generateMetadata({ params }: HistoryPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  return MetadataFactory.build({
    locale,
    title: dictionary.meta.history.title,
    description: dictionary.meta.history.description,
    path: "/historia",
  });
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const copy = dictionary.history;

  return (
    <>
      <JsonLd
        data={JsonLdFactory.breadcrumbs(locale, [
          { name: dictionary.nav.home, path: "" },
          { name: dictionary.nav.history, path: "/historia" },
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
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-surface">
            <Image
              src={STORY_MEDIA.src}
              alt={STORY_MEDIA.alt[locale]}
              width={STORY_MEDIA.width}
              height={STORY_MEDIA.height}
              priority
              sizes="(max-width: 1024px) 92vw, 1120px"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-page grid gap-12 lg:grid-cols-[0.36fr_0.64fr] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+32px)] lg:self-start">
            <p className="eyebrow">{copy.eyebrow}</p>
            <blockquote className="mt-5 font-display text-3xl italic leading-snug text-gold-soft">
              “{copy.quote}”
            </blockquote>
          </div>

          <div className="space-y-10">
            {copy.chapters.map((chapter, index) => (
              <article key={chapter.title} className="border-t border-border/60 pt-6">
                <p aria-hidden className="font-display text-4xl text-gold/60">
                  0{index + 1}
                </p>
                <h2 className="display-2 mt-2">{chapter.title}</h2>
                <p className="mt-3 max-w-prose text-base leading-relaxed text-muted">
                  {chapter.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight border-t border-border/50 bg-elevated/20">
        <div className="container-page">
          <h2 className="display-2">{copy.valuesTitle}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.values.map((value, index) => (
              <div key={value.title} className="card-soft p-6">
                <p aria-hidden className="font-display text-3xl text-gold/70">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-xl">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <h2 className="display-2 max-w-xl">{copy.lead}</h2>
          <Link href={localePath(locale, "/reservar")} className="btn btn-primary shrink-0">
            {copy.cta}
            <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
