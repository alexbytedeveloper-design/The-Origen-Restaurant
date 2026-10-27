import { z } from "zod";
import { RESERVATION_ZONES } from "./reservation.types";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;

export const reservationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "name_too_short")
      .max(80, "name_too_long")
      .regex(/^[\p{L}\p{M}.'’\- ]+$/u, "name_invalid"),
    contact: z
      .string()
      .trim()
      .min(6, "contact_too_short")
      .max(25, "contact_too_long")
      .regex(/^\+?[\d\s().-]+$/, "contact_invalid")
      .refine((value) => value.replace(/\D/g, "").length >= 6, "contact_invalid"),
    partySize: z.coerce
      .number()
      .int("party_size_invalid")
      .min(1, "party_size_invalid")
      .max(12, "party_size_invalid"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date_invalid"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "time_invalid"),
    zone: z.enum(RESERVATION_ZONES),
    notes: z
      .string()
      .trim()
      .max(400, "notes_too_long")
      .refine((value) => !CONTROL_CHARACTERS.test(value), "notes_invalid")
      .default(""),
    locale: z.enum(["es", "en"]),
    website: z.string().max(200).optional().default(""),
  })
  .strict();

export type ReservationInput = z.infer<typeof reservationSchema>;

export const reservationFieldNames = [
  "name",
  "contact",
  "partySize",
  "date",
  "time",
  "notes",
] as const;

export type ReservationFieldName = (typeof reservationFieldNames)[number];
