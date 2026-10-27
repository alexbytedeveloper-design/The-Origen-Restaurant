export class RateLimitPolicy {
  public constructor(
    public readonly limit: number,
    public readonly windowMs: number,
  ) {
    if (limit < 1 || windowMs < 1) {
      throw new RangeError("Rate limit policy values must be positive.");
    }
  }
}

export interface RateLimitDecision {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly retryAfterSeconds: number;
}

export interface RateLimiter {
  consume(key: string, policy: RateLimitPolicy): RateLimitDecision;
}
