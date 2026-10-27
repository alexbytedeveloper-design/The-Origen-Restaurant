"use client";

import { useState } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { THEME_COOKIE, themeColor, type Theme } from "@/lib/theme/theme";

interface ThemeToggleProps {
  readonly initialTheme: Theme;
  readonly labels: {
    readonly toDark: string;
    readonly toLight: string;
  };
}

export function ThemeToggle({ initialTheme, labels }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const nextTheme: Theme = theme === "dark" ? "light" : "dark";
  const label = nextTheme === "dark" ? labels.toDark : labels.toLight;

  const toggleTheme = () => {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${THEME_COOKIE}=${nextTheme}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", themeColor(nextTheme));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-muted transition-colors hover:border-gold/60 hover:text-gold-soft"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
