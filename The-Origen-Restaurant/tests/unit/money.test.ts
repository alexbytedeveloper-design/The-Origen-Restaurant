import { describe, expect, it } from "vitest";
import { Money } from "@/domain/menu/money";

describe("Money", () => {
  it("formats USD with two decimals and currency", () => {
    expect(Money.fromAmount(12).format()).toBe("$12.00 USD");
    expect(Money.fromAmount(9.5).format()).toBe("$9.50 USD");
  });

  it("rejects negative and non-finite amounts", () => {
    expect(() => Money.fromAmount(-1)).toThrow(RangeError);
    expect(() => Money.fromAmount(Number.NaN)).toThrow(RangeError);
  });
});
