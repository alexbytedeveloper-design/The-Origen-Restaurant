"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { LocaleSwitch } from "@/components/layout/locale-switch";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/content/dictionaries";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Theme } from "@/lib/theme/theme";
import { cn } from "@/lib/utils/cn";

interface HeaderNavigationProps {
  readonly locale: Locale;
  readonly theme: Theme;
  readonly copy: {
    readonly nav: Dictionary["nav"];
    readonly header: Dictionary["header"];
    readonly common: Dictionary["common"];
  };
}

export function HeaderNavigation({ locale, theme, copy }: HeaderNavigationProps) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const items = [
    { href: localePath(locale), label: copy.nav.home, exact: true },
    { href: localePath(locale, "/menu"), label: copy.nav.menu, exact: false },
    { href: localePath(locale, "/historia"), label: copy.nav.history, exact: false },
    { href: localePath(locale, "/galeria"), label: copy.nav.gallery, exact: false },
  ] as const;

  const reservationHref = localePath(locale, "/reservar");

  const isActive = (href: string, exact: boolean): boolean => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    dialogRef.current?.close();
  };

  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );

  const restoreScroll = () => {
    document.body.style.overflow = "";
  };

  return (
    <>
      <nav
        aria-label={copy.header.menuLabel}
        className="hidden items-center gap-8 lg:flex"
      >
        {items.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative py-2 text-[13px] font-medium tracking-wide transition-colors",
                active ? "text-gold-soft" : "text-muted hover:text-text",
              )}
            >
              {item.label}
              {active ? (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px bg-gold"
                />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <span aria-hidden className="mx-1 hidden h-5 w-px bg-border lg:block" />
        <LocaleSwitch locale={locale} label={copy.header.language} />
        <ThemeToggle
          initialTheme={theme}
          labels={{
            toDark: copy.header.themeToDark,
            toLight: copy.header.themeToLight,
          }}
        />
        <Link
          href={reservationHref}
          className="btn btn-primary ml-1 hidden md:inline-flex"
        >
          {copy.common.reserve}
        </Link>
        <button
          type="button"
          onClick={openMenu}
          aria-label={copy.header.openMenu}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-text transition-colors hover:border-gold/60 hover:text-gold-soft lg:hidden"
        >
          <MenuIcon />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={copy.header.menuLabel}
        onClose={restoreScroll}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        className="fixed inset-0 z-50 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-bg p-0 text-text open:block"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[var(--header-height)] items-center justify-between border-b border-border/60 px-5">
            <span className="eyebrow">{copy.header.menuLabel}</span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label={copy.header.closeMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-text"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-8">
            <ul className="space-y-1">
              {items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-baseline justify-between border-b border-border/40 py-4 font-display text-3xl transition-colors",
                        active ? "text-gold-soft" : "text-text hover:text-gold-soft",
                      )}
                    >
                      {item.label}
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted">
                        0{items.indexOf(item) + 1}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
                {copy.header.language}
              </span>
              <LocaleSwitch locale={locale} label={copy.header.language} variant="button" />
            </div>
          </nav>

          <div className="border-t border-border/60 p-5">
            <Link
              href={reservationHref}
              onClick={closeMenu}
              className="btn btn-primary w-full"
            >
              {copy.common.reserve}
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
