import type {
  RateLimitDecision,
  RateLimiter,
  RateLimitPolicy,
} from "./rate-limiter";

const SWEEP_INTERVAL_MS = 60_000;
const MAX_BUCKETS = 10_000;

export class SlidingWindowRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, number[]>();
  private lastSweep = 0;

  public constructor(private readonly now: () => number = Date.now) {}

  public consume(key: string, policy: RateLimitPolicy): RateLimitDecision {
    const current = this.now();
    this.sweep(current);

    const windowStart = current - policy.windowMs;
    const timestamps = (this.buckets.get(key) ?? []).filter(
      (timestamp) => timestamp > windowStart,
    );

    if (timestamps.length >= policy.limit) {
      const oldest = timestamps[0] ?? current;
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((oldest + policy.windowMs - current) / 1000),
      );
      this.buckets.set(key, timestamps);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    timestamps.push(current);
    this.buckets.set(key, timestamps);
    return {
      allowed: true,
      remaining: policy.limit - timestamps.length,
      retryAfterSeconds: 0,
    };
  }

  private sweep(now: number): void {
    if (now - this.lastSweep < SWEEP_INTERVAL_MS) return;
    this.lastSweep = now;

    for (const [key, timestamps] of this.buckets) {
      const lastTimestamp = timestamps[timestamps.length - 1];
      if (lastTimestamp === undefined || lastTimestamp < now - 3_600_000) {
        this.buckets.delete(key);
      }
    }

    if (this.buckets.size > MAX_BUCKETS) {
      const overflow = this.buckets.size - MAX_BUCKETS;
      let removed = 0;
      for (const key of this.buckets.keys()) {
        this.buckets.delete(key);
        removed += 1;
        if (removed >= overflow) break;
      }
    }
  }
}
