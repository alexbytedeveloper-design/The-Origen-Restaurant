export const THEME_COOKIE = "origen_theme";

export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";

export const isTheme = (value: string | undefined): value is Theme =>
  value === "dark" || value === "light";

export const resolveTheme = (value: string | undefined): Theme =>
  isTheme(value) ? value : DEFAULT_THEME;

export const themeColor = (theme: Theme): string =>
  theme === "dark" ? "#14100D" : "#FAF6EF";
