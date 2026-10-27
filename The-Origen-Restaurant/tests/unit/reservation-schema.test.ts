import { describe, expect, it } from "vitest";
import { reservationSchema } from "@/domain/reservations/reservation.schema";

const validInput = {
  name: "Ana Pérez",
  contact: "+53 5 555 0100",
  partySize: 2,
  date: "2026-11-07",
  time: "20:00",
  zone: "any" as const,
  notes: "Mesa junto a la ventana",
  locale: "es" as const,
  website: "",
};

describe("reservationSchema", () => {
  it("accepts a complete request", () => {
    const result = reservationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("coerces the party size from a form string", () => {
    const result = reservationSchema.safeParse({ ...validInput, partySize: "4" });
    expect(result.success && result.data.partySize).toBe(4);
  });

  it("rejects out-of-range parties", () => {
    expect(reservationSchema.safeParse({ ...validInput, partySize: 13 }).success).toBe(false);
    expect(reservationSchema.safeParse({ ...validInput, partySize: 0 }).success).toBe(false);
  });

  it("rejects an invalid phone number", () => {
    expect(reservationSchema.safeParse({ ...validInput, contact: "abc" }).success).toBe(false);
    expect(reservationSchema.safeParse({ ...validInput, contact: "12" }).success).toBe(false);
  });

  it("rejects notes over 400 characters", () => {
    expect(
      reservationSchema.safeParse({ ...validInput, notes: "a".repeat(401) }).success,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      reservationSchema.safeParse({ ...validInput, admin: true }).success,
    ).toBe(false);
  });
});
