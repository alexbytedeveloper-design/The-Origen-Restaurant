import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { htmlLang, isLocale } from "@/lib/i18n/config";
import { resolveTheme, THEME_COOKIE, themeColor } from "@/lib/theme/theme";
import { Environment } from "@/server/config/environment";
import "./globals.css";

const cormorant = localFont({
  src: "../assets/fonts/cormorant-garamond-latin.woff2",
  variable: "--font-cormorant",
  display: "swap",
  weight: "300 700",
  style: "normal",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

const manrope = localFont({
  src: "../assets/fonts/manrope-latin.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
  style: "normal",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(Environment.siteUrl),
  title: {
    default: "The Origen",
    template: "%s",
  },
  description: "Cocina cubana de autor en La Habana.",
  applicationName: "The Origen",
  manifest: "/manifest.webmanifest",
};

export async function generateViewport(): Promise<Viewport> {
  const theme = resolveTheme((await cookies()).get(THEME_COOKIE)?.value);
  return {
    themeColor: themeColor(theme),
    colorScheme: theme,
  };
}

export default async function RootLayout({ children }: { readonly children: ReactNode }) {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const theme = resolveTheme(cookieStore.get(THEME_COOKIE)?.value);
  const headerLocale = headerStore.get("x-locale");
  const locale = headerLocale && isLocale(headerLocale) ? headerLocale : "es";

  return (
    <html
      lang={htmlLang(locale)}
      data-theme={theme}
      className={`${cormorant.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="grain">{children}</body>
    </html>
  );
}
