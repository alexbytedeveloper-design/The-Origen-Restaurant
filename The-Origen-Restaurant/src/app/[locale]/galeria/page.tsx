import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/content/dictionaries";
import { GALLERY_MEDIA } from "@/content/media";
import { resolveLocale } from "@/lib/i18n/page";
import { JsonLdFactory } from "@/lib/seo/json-ld";
import { MetadataFactory } from "@/lib/seo/metadata";

interface GalleryPageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  return MetadataFactory.build({
    locale,
    title: dictionary.meta.gallery.title,
    description: dictionary.meta.gallery.description,
    path: "/galeria",
  });
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const copy = dictionary.gallery;

  return (
    <>
      <JsonLd
        data={JsonLdFactory.breadcrumbs(locale, [
          { name: dictionary.nav.home, path: "" },
          { name: dictionary.nav.gallery, path: "/galeria" },
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
          <GalleryGrid assets={GALLERY_MEDIA} locale={locale} copy={copy} />
        </div>
      </section>
    </>
  );
}
