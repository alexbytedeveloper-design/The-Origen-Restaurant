import type { Metadata } from "next";
import { MenuExplorer } from "@/components/menu/menu-explorer";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/content/dictionaries";
import { MENU_DOCUMENT } from "@/content/menu";
import { resolveLocale } from "@/lib/i18n/page";
import { JsonLdFactory } from "@/lib/seo/json-ld";
import { MetadataFactory } from "@/lib/seo/metadata";

interface MenuPageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

export async function generateMetadata({ params }: MenuPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  return MetadataFactory.build({
    locale,
    title: dictionary.meta.menu.title,
    description: dictionary.meta.menu.description,
    path: "/menu",
  });
}

export default async function MenuPage({ params }: MenuPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const copy = dictionary.menu;

  return (
    <>
      <JsonLd data={JsonLdFactory.menu(MENU_DOCUMENT, locale)} />
      <JsonLd
        data={JsonLdFactory.breadcrumbs(locale, [
          { name: dictionary.nav.home, path: "" },
          { name: dictionary.nav.menu, path: "/menu" },
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
          <MenuExplorer
            categories={MENU_DOCUMENT.categories}
            locale={locale}
            copy={copy}
            common={dictionary.common}
          />
        </div>
      </section>
    </>
  );
}
