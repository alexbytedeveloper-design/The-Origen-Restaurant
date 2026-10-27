export class WhatsAppLinkFactory {
  private readonly digits: string;

  public constructor(phoneNumber: string) {
    const digits = phoneNumber.replace(/\D/g, "");
    if (!/^\d{8,15}$/.test(digits)) {
      throw new Error("WhatsApp number must contain between 8 and 15 digits.");
    }
    this.digits = digits;
  }

  public create(message: string): string {
    return `https://wa.me/${this.digits}?text=${encodeURIComponent(message)}`;
  }
}
