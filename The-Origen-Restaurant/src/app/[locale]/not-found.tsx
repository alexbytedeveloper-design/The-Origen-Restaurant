import { headers } from "next/headers";
import Link from "next/link";
import { getDictionary } from "@/content/dictionaries";
import { localePath } from "@/lib/i18n/config";

export default async function LocaleNotFound() {
  const headerStore = await headers();
  const locale = headerStore.get("x-locale") === "en" ? "en" : "es";
  const dictionary = getDictionary(locale);
  const copy = dictionary.notFound;

  return (
    <section className="section">
      <div className="container-page flex min-h-[55vh] flex-col items-center justify-center text-center">
        <p aria-hidden className="font-display text-8xl leading-none text-gold/40">
          404
        </p>
        <p className="eyebrow mt-4">{copy.eyebrow}</p>
        <h1 className="display-1 mt-4">{copy.title}</h1>
        <p className="lead mt-4">{copy.lead}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={localePath(locale)} className="btn btn-primary">
            {copy.cta}
          </Link>
          <Link href={localePath(locale, "/menu")} className="btn btn-secondary">
            {dictionary.common.viewMenu}
          </Link>
        </div>
      </div>
    </section>
  );
}
