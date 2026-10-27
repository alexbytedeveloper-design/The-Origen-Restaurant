const DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Havana",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export class HavanaClock {
  public today(): string {
    return DATE_FORMATTER.format(new Date());
  }

  public addDays(isoDate: string, days: number): string {
    const date = new Date(`${isoDate}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  public isWithinWindow(isoDate: string, today: string, maxDaysAhead: number): boolean {
    return isoDate >= today && isoDate <= this.addDays(today, maxDaysAhead);
  }
}
