import type { QrScanInput } from "@/domain/qr/qr.types";
import { QR_CHANNELS } from "@/domain/qr/qr.types";
import type { StructuredLogger } from "@/server/core/logger";
import type { RequestContext } from "@/server/http/request-context";
import type { HmacHasher } from "@/server/infrastructure/hashing/hmac-hasher";
import type { RateLimiter } from "@/server/infrastructure/rate-limit/rate-limiter";
import { RATE_LIMITS } from "@/server/infrastructure/rate-limit/rate-limit.registry";

const DEDUPE_WINDOW_MS = 30_000;
const MAX_RECENT_ENTRIES = 5_000;

export interface QrSnapshot {
  readonly total: number;
  readonly byChannel: Readonly<Record<string, number>>;
}

export class QrScanService {
  private total = 0;
  private readonly byChannel = new Map<string, number>();
  private readonly recent = new Map<string, number>();

  public constructor(
    private readonly rateLimiter: RateLimiter,
    private readonly hasher: HmacHasher,
    private readonly logger: StructuredLogger,
    private readonly now: () => number = Date.now,
  ) {}

  public record(input: QrScanInput, context: RequestContext): void {
    if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(input.slug)) return;
    const channel = this.resolveChannel(input.channel);
    const current = this.now();
    const ipHash = this.hasher.hash(context.ip).slice(0, 32);
    const dedupeKey = `${ipHash}:${input.slug}`;

    const lastSeen = this.recent.get(dedupeKey);
    if (lastSeen !== undefined && current - lastSeen < DEDUPE_WINDOW_MS) return;
    this.recent.set(dedupeKey, current);
    this.pruneRecent(current);

    const ipDecision = this.rateLimiter.consume(`qr:ip:${ipHash}`, RATE_LIMITS.qrByIp);
    if (!ipDecision.allowed) {
      this.logger.warn("qr.rate_limited", { scope: "ip" });
      return;
    }

    const slugDecision = this.rateLimiter.consume(
      `qr:slug:${input.slug}`,
      RATE_LIMITS.qrBySlug,
    );
    if (!slugDecision.allowed) {
      this.logger.warn("qr.rate_limited", { scope: "slug", slug: input.slug });
      return;
    }

    this.total += 1;
    this.byChannel.set(channel, (this.byChannel.get(channel) ?? 0) + 1);
    this.logger.info("qr.scanned", {
      slug: input.slug,
      channel,
      userAgentFamily: context.userAgentFamily,
    });
  }

  public snapshot(): QrSnapshot {
    return {
      total: this.total,
      byChannel: Object.fromEntries(this.byChannel),
    };
  }

  private resolveChannel(channel: string | undefined): string {
    if (!channel) return "direct";
    return QR_CHANNELS.includes(channel as (typeof QR_CHANNELS)[number])
      ? channel
      : "direct";
  }

  private pruneRecent(current: number): void {
    if (this.recent.size <= MAX_RECENT_ENTRIES) return;
    for (const [key, timestamp] of this.recent) {
      if (current - timestamp > DEDUPE_WINDOW_MS) {
        this.recent.delete(key);
      }
    }
  }
}
