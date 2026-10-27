import { createHmac } from "node:crypto";

export class HmacHasher {
  public constructor(private readonly secret: string) {
    if (secret.length < 16) {
      throw new Error("HMAC secret must be at least 16 characters long.");
    }
  }

  public hash(value: string): string {
    return createHmac("sha256", this.secret).update(value, "utf8").digest("hex");
  }
}
