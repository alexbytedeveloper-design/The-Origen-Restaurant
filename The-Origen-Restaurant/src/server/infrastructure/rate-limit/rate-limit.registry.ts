import { RateLimitPolicy } from "./rate-limiter";
import { SlidingWindowRateLimiter } from "./sliding-window-rate-limiter";

export const RATE_LIMITS = {
  reservationByIp: new RateLimitPolicy(5, 60 * 60 * 1000),
  reservationByContact: new RateLimitPolicy(3, 60 * 60 * 1000),
  qrByIp: new RateLimitPolicy(30, 60 * 1000),
  qrBySlug: new RateLimitPolicy(60, 60 * 1000),
} as const;

export const rateLimiter = new SlidingWindowRateLimiter();
