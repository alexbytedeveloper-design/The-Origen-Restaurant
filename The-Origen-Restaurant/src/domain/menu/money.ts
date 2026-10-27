export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: "USD",
  ) {}

  public static fromAmount(amount: number): Money {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new RangeError("Money amount must be a finite, non-negative number.");
    }
    return new Money(amount, "USD");
  }

  public format(): string {
    return `$${this.amount.toFixed(2)} ${this.currency}`;
  }

  public withCurrency(currency: "USD"): Money {
    return new Money(this.amount, currency);
  }
}
