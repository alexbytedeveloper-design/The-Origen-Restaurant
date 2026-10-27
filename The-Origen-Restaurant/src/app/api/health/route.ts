import { menuService } from "@/server/domain/menu/menu.container";
import { qrScanService } from "@/server/domain/qr/qr.container";
import { ApiResponse } from "@/server/http/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return ApiResponse.success(
    {
      status: "ok",
      environment: process.env.NODE_ENV ?? "unknown",
      menu: menuService.getStats(),
      qr: qrScanService.snapshot(),
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
