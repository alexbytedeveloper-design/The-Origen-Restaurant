import { randomInt } from "node:crypto";

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_LENGTH = 6;

export class ReferenceFactory {
  public create(): string {
    let code = "";
    for (let index = 0; index < CODE_LENGTH; index += 1) {
      const position = randomInt(0, ALPHABET.length);
      code += ALPHABET.charAt(position);
    }
    return `ORG-${code}`;
  }
}
