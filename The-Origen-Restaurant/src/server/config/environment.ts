import { RESTAURANT } from "@/content/restaurant";

const read = (key: string, fallback: string): string => {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : fallback;
};

export class Environment {
  public static readonly siteUrl = read("NEXT_PUBLIC_SITE_URL", RESTAURANT.siteUrl).replace(
    /\/+$/,
    "",
  );

  public static readonly whatsappNumber = read(
    "NEXT_PUBLIC_WHATSAPP_NUMBER",
    RESTAURANT.whatsappNumber,
  ).replace(/\D/g, "");

  public static readonly ipSalt = read(
    "RESERVATION_IP_SALT",
    "local-development-salt-change-me",
  );

  public static get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }
}
