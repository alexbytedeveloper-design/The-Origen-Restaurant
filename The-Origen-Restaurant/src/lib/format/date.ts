export const addDaysIso = (isoDate: string, days: number): string => {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

export const formatLongDate = (isoDate: string, locale: "es" | "en"): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "";
  return new Intl.DateTimeFormat(locale === "es" ? "es-CU" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Havana",
  }).format(new Date(`${isoDate}T12:00:00Z`));
};

export const formatShortDate = (isoDate: string, locale: "es" | "en"): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "";
  return new Intl.DateTimeFormat(locale === "es" ? "es-CU" : "en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "America/Havana",
  }).format(new Date(`${isoDate}T12:00:00Z`));
};

export const formatWeekday = (weekday: number, locale: "es" | "en"): string => {
  const reference = new Date(Date.UTC(2024, 0, 7 + weekday));
  return new Intl.DateTimeFormat(locale === "es" ? "es-CU" : "en-GB", {
    weekday: "long",
    timeZone: "UTC",
  }).format(reference);
};
