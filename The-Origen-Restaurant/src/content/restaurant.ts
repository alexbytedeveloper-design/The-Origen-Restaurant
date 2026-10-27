import type { OpeningDay } from "@/domain/reservations/service-schedule";

export const RESTAURANT = {
  name: "The Origen",
  shortName: "Origen",
  legalName: "The Origen",
  established: 2025,
  city: "La Habana",
  country: "Cuba",
  countryCode: "CU",
  address: {
    street: "Calle 12 #115, Vedado",
    locality: "La Habana",
    region: "La Habana",
    postalCode: "10400",
  },
  geo: {
    latitude: 23.1136,
    longitude: -82.3666,
  },
  phone: "+53 5 555 0100",
  whatsappNumber: "5355550100",
  email: "reservas@theorigen.cu",
  siteUrl: "https://the-origen-restaurant.vercel.app",
  priceRange: "$$$",
  cuisines: ["Cubana", "Contemporánea", "Caribeña"],
  social: {
    instagram: "https://www.instagram.com/theorigenhabana/",
    facebook: "https://www.facebook.com/theorigenhabana",
  },
  serviceDays: [
    { weekday: 1, closed: true },
    { weekday: 2, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
    { weekday: 3, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
    { weekday: 4, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
    { weekday: 5, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
    { weekday: 6, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
    { weekday: 0, closed: false, opens: "12:00", closes: "00:00", lastSeating: "22:30" },
  ] satisfies readonly OpeningDay[],
  reservation: {
    minPartySize: 1,
    maxPartySize: 12,
    maxDaysAhead: 90,
    slotStepMinutes: 30,
    turnoverMinutes: 90,
    timeZone: "America/Havana",
  },
  zones: ["any", "salon", "terraza", "barra"] as const,
  /** Every value above is a demo placeholder until the restaurant confirms it. */
  isPlaceholderContent: true,
} as const;

export type RestaurantConfig = typeof RESTAURANT;
