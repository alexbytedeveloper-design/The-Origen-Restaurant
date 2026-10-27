import { describe, expect, it } from "vitest";
import type { ReservationInput } from "@/domain/reservations/reservation.schema";
import { WhatsAppMessageBuilder } from "@/server/domain/reservations/whatsapp-message.builder";

const input: ReservationInput = {
  name: "Ana Pérez",
  contact: "+53 5 555 0100",
  partySize: 2,
  date: "2026-11-07",
  time: "20:00",
  zone: "terraza",
  notes: "",
  locale: "es",
  website: "",
};

describe("WhatsAppMessageBuilder", () => {
  const builder = new WhatsAppMessageBuilder();

  it("builds a Spanish message with the reference and area", () => {
    const message = builder.build(input, "OR-TEST01");
    expect(message).toContain("Quiero reservar una mesa");
    expect(message).toContain("Personas: 2");
    expect(message).toContain("Zona: Terraza");
    expect(message).toContain("Referencia: OR-TEST01");
  });

  it("builds an English message with a 12-hour time", () => {
    const message = builder.build({ ...input, locale: "en", zone: "barra" }, "OR-TEST02");
    expect(message).toContain("I would like to book a table");
    expect(message).toContain("Area: Bar");
    expect(message).toContain("Time: 8:00 PM");
    expect(message).toContain("Reference: OR-TEST02");
  });

  it("includes notes only when present", () => {
    expect(builder.build(input, "OR-TEST03")).not.toContain("Notas:");
    expect(
      builder.build({ ...input, notes: "Sin gluten" }, "OR-TEST04"),
    ).toContain("Notas: Sin gluten");
  });
});
