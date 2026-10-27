export const RESERVATION_ZONES = ["any", "salon", "terraza", "barra"] as const;

export type ReservationZone = (typeof RESERVATION_ZONES)[number];

export interface ReservationSummary {
  readonly guestName: string;
  readonly partySize: number;
  readonly date: string;
  readonly time: string;
  readonly zone: ReservationZone;
}

export interface ReservationResult {
  readonly reference: string;
  readonly status: "pending";
  readonly whatsappUrl: string;
  readonly message: string;
  readonly summary: ReservationSummary;
}
