export type OpeningDay =
  | { readonly weekday: number; readonly closed: true }
  | {
      readonly weekday: number;
      readonly closed: false;
      readonly opens: string;
      readonly closes: string;
      readonly lastSeating: string;
    };

const MINUTES_IN_DAY = 24 * 60;

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  if (hours === undefined || minutes === undefined) {
    throw new Error(`Invalid time: ${time}`);
  }
  return (hours % 24) * 60 + minutes;
};

const toTime = (minutes: number): string => {
  const normalized = ((minutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

export class ServiceSchedule {
  public constructor(
    private readonly days: readonly OpeningDay[],
    private readonly stepMinutes = 30,
  ) {}

  public static weekdayOf(isoDate: string): number {
    return new Date(`${isoDate}T12:00:00Z`).getUTCDay();
  }

  public findDay(isoDate: string): OpeningDay | undefined {
    const weekday = ServiceSchedule.weekdayOf(isoDate);
    return this.days.find((day) => day.weekday === weekday);
  }

  public isOpen(isoDate: string): boolean {
    const day = this.findDay(isoDate);
    return Boolean(day && !day.closed);
  }

  public slotsFor(isoDate: string): readonly string[] {
    const day = this.findDay(isoDate);
    if (!day || day.closed) return [];
    const start = toMinutes(day.opens);
    const last = toMinutes(day.lastSeating);
    const slots: string[] = [];
    for (let minute = start; minute <= last; minute += this.stepMinutes) {
      slots.push(toTime(minute));
    }
    return slots;
  }

  public isSlotAvailable(isoDate: string, time: string): boolean {
    return this.slotsFor(isoDate).includes(time);
  }
}
