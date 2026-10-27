import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getDictionary } from "@/content/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import { resolveTheme, THEME_COOKIE } from "@/lib/theme/theme";

export const dynamic = "force-dynamic";

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ readonly locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);
  const theme = resolveTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        {dictionary.header.skip}
      </a>
      <SiteHeader locale={locale} theme={theme} dictionary={dictionary} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
