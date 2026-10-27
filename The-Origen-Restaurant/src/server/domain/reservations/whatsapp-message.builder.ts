import type { Locale } from "@/domain/menu/menu.types";
import type { ReservationInput } from "@/domain/reservations/reservation.schema";
import type { ReservationZone } from "@/domain/reservations/reservation.types";

const ZONE_LABELS: Record<ReservationZone, Record<Locale, string>> = {
  any: { es: "Sin preferencia", en: "No preference" },
  salon: { es: "Salón", en: "Dining room" },
  terraza: { es: "Terraza", en: "Terrace" },
  barra: { es: "Barra", en: "Bar" },
};

const DATE_LOCALES: Record<Locale, string> = {
  es: "es-CU",
  en: "en-GB",
};

export class WhatsAppMessageBuilder {
  public build(input: ReservationInput, reference: string): string {
    const zone = ZONE_LABELS[input.zone][input.locale];
    const date = this.formatDate(input.date, input.locale);
    const time = this.formatTime(input.time, input.locale);

    const lines =
      input.locale === "es"
        ? [
            "Hola, The Origen. Quiero reservar una mesa.",
            "",
            `Nombre: ${input.name}`,
            `Personas: ${input.partySize}`,
            `Fecha: ${date}`,
            `Hora: ${time}`,
            `Zona: ${zone}`,
          ]
        : [
            "Hello, The Origen. I would like to book a table.",
            "",
            `Name: ${input.name}`,
            `Guests: ${input.partySize}`,
            `Date: ${date}`,
            `Time: ${time}`,
            `Area: ${zone}`,
          ];

    if (input.notes.trim().length > 0) {
      lines.push(`${input.locale === "es" ? "Notas" : "Notes"}: ${input.notes.trim()}`);
    }

    lines.push(
      `${input.locale === "es" ? "Referencia" : "Reference"}: ${reference}`,
      "",
      input.locale === "es"
        ? "Quedo pendiente de confirmación. Gracias."
        : "I look forward to your confirmation. Thank you.",
    );

    return lines.join("\n");
  }

  private formatDate(isoDate: string, locale: Locale): string {
    return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Havana",
    }).format(new Date(`${isoDate}T12:00:00Z`));
  }

  private formatTime(time: string, locale: Locale): string {
    if (locale === "es") return time;
    const [hours, minutes] = time.split(":").map(Number);
    const referenceDate = new Date(Date.UTC(2026, 0, 1, hours ?? 0, minutes ?? 0));
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }).format(referenceDate);
  }
}
