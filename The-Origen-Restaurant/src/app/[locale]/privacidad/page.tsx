import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/content/dictionaries";
import { RESTAURANT } from "@/content/restaurant";
import { resolveLocale } from "@/lib/i18n/page";
import { JsonLdFactory } from "@/lib/seo/json-ld";
import { MetadataFactory } from "@/lib/seo/metadata";

interface PrivacyPageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  return MetadataFactory.build({
    locale,
    title: dictionary.meta.privacy.title,
    description: dictionary.meta.privacy.description,
    path: "/privacidad",
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const copy = dictionary.privacy;

  return (
    <>
      <JsonLd
        data={JsonLdFactory.breadcrumbs(locale, [
          { name: dictionary.nav.home, path: "" },
          { name: copy.title, path: "/privacidad" },
        ])}
      />

      <section className="border-b border-border/50">
        <div className="container-page pb-8 pt-10 lg:pb-10 lg:pt-14">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="display-1 mt-4">{copy.title}</h1>
          <p className="mt-4 text-sm text-muted">{copy.updated}</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-page grid gap-10 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16">
          <aside className="lg:sticky lg:top-[calc(var(--header-height)+32px)] lg:self-start">
            <p className="text-sm leading-relaxed text-muted">{copy.contact}</p>
            <a
              href={`mailto:${RESTAURANT.email}`}
              className="mt-3 inline-block text-sm text-gold-soft transition-colors hover:text-gold"
            >
              {RESTAURANT.email}
            </a>
          </aside>

          <div className="space-y-8">
            {copy.sections.map((section, index) => (
              <article key={section.title} className="border-t border-border/60 pt-6">
                <div className="flex items-baseline gap-3">
                  <span aria-hidden className="font-display text-2xl text-gold/70">
                    0{index + 1}
                  </span>
                  <h2 className="font-display text-2xl">{section.title}</h2>
                </div>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
