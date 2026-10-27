import { describe, expect, it } from "vitest";
import { ServiceSchedule, type OpeningDay } from "@/domain/reservations/service-schedule";

const days: readonly OpeningDay[] = [
  { weekday: 1, closed: true },
  { weekday: 2, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
  { weekday: 3, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
  { weekday: 4, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
  { weekday: 5, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
  { weekday: 6, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
  { weekday: 0, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
];

describe("ServiceSchedule", () => {
  const schedule = new ServiceSchedule(days, 30);

  it("closes on Mondays", () => {
    expect(schedule.isOpen("2026-11-02")).toBe(false);
    expect(schedule.slotsFor("2026-11-02")).toEqual([]);
  });

  it("builds slots from opening to last seating", () => {
    const slots = schedule.slotsFor("2026-11-03");
    expect(slots).toHaveLength(22);
    expect(slots[0]).toBe("12:00");
    expect(slots.at(-1)).toBe("22:30");
  });

  it("validates the slot grid", () => {
    expect(schedule.isSlotAvailable("2026-11-03", "20:00")).toBe(true);
    expect(schedule.isSlotAvailable("2026-11-03", "20:15")).toBe(false);
    expect(schedule.isSlotAvailable("2026-11-03", "23:00")).toBe(false);
  });

  it("rejects unknown weekdays", () => {
    const empty = new ServiceSchedule([], 30);
    expect(empty.isOpen("2026-11-03")).toBe(false);
  });
});
