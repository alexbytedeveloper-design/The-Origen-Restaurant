export const buildWhatsAppUrl = (phoneNumber: string, message: string): string => {
  const digits = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

export const DIRECT_WHATSAPP_MESSAGES = {
  es: "Hola, The Origen. Quiero consultar disponibilidad para una mesa.",
  en: "Hello, The Origen. I would like to check table availability.",
} as const;

export const DIRECT_WHATSAPP_GROUP_MESSAGES = {
  es: "Hola, The Origen. Quiero consultar una reserva para un grupo de más de 12 personas.",
  en: "Hello, The Origen. I would like to ask about a booking for a group of more than 12 guests.",
} as const;
