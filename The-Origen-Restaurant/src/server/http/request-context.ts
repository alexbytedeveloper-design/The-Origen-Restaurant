import { AppError } from "@/server/core/app-error";

const FAMILY_PATTERNS: readonly [string, RegExp][] = [
  ["edge", /Edg\//i],
  ["chrome", /Chrome\/|CriOS\//i],
  ["firefox", /Firefox\/|FxiOS\//i],
  ["safari", /Safari\//i],
  ["opera", /OPR\/|Opera/i],
  ["bot", /bot|crawler|spider|preview/i],
];

export class RequestContext {
  private constructor(
    public readonly ip: string,
    public readonly userAgent: string,
    public readonly userAgentFamily: string,
    public readonly host: string,
    public readonly origin: string | null,
    public readonly fetchSite: string | null,
  ) {}

  public static from(request: Request): RequestContext {
    const headers = request.headers;
    const forwarded = headers.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0]?.trim() ||
      headers.get("x-real-ip")?.trim() ||
      "127.0.0.1";
    const userAgent = headers.get("user-agent") ?? "";
    const family =
      FAMILY_PATTERNS.find(([, pattern]) => pattern.test(userAgent))?.[0] ?? "other";

    return new RequestContext(
      ip,
      userAgent,
      family,
      headers.get("host") ?? "",
      headers.get("origin"),
      headers.get("sec-fetch-site"),
    );
  }

  public assertSameOrigin(): void {
    if (this.fetchSite && this.fetchSite !== "same-origin" && this.fetchSite !== "same-site") {
      throw AppError.forbidden();
    }
    if (!this.origin) return;
    if (this.host.length === 0) {
      throw AppError.forbidden();
    }
    let originHost: string;
    try {
      originHost = new URL(this.origin).host;
    } catch {
      throw AppError.forbidden();
    }
    if (originHost !== this.host) {
      throw AppError.forbidden();
    }
  }
}
