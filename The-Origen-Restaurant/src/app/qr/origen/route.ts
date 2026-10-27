import { after, NextResponse } from "next/server";
import { qrScanService } from "@/server/domain/qr/qr.container";
import { RequestContext } from "@/server/http/request-context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_CHANNELS = new Set(["table", "poster", "flyer", "direct"]);

export function GET(request: Request) {
  const url = new URL(request.url);
  const requestedChannel = url.searchParams.get("channel") ?? undefined;
  const channel =
    requestedChannel && ALLOWED_CHANNELS.has(requestedChannel)
      ? requestedChannel
      : undefined;
  const context = RequestContext.from(request);

  after(() => {
    qrScanService.record({ slug: "origen", channel }, context);
  });

  const destination = new URL("/es/menu", url);
  destination.searchParams.set("utm_source", "qr");
  destination.searchParams.set("utm_medium", channel ?? "direct");

  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
