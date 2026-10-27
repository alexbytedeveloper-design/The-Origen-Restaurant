import { menuService } from "@/server/domain/menu/menu.container";
import { ApiResponse } from "@/server/http/api-response";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 60;

export function GET() {
  const document = menuService.getDocument();

  return ApiResponse.success(
    {
      categories: document.categories,
      updatedAt: document.updatedAt,
      currency: document.currency,
      stats: menuService.getStats(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
