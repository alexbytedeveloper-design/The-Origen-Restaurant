import { qrScanSchema } from "@/domain/qr/qr.schema";
import { AppError } from "@/server/core/app-error";
import { logger } from "@/server/core/logger";
import { qrScanService } from "@/server/domain/qr/qr.container";
import { ApiResponse } from "@/server/http/api-response";
import { JsonBodyReader } from "@/server/http/json-body";
import { RequestContext } from "@/server/http/request-context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const context = RequestContext.from(request);

  try {
    context.assertSameOrigin();
    const body = await JsonBodyReader.read(request, 2 * 1024);
    const parsed = qrScanSchema.safeParse(body);

    if (!parsed.success) {
      throw AppError.validation("Invalid QR payload.");
    }

    qrScanService.record(parsed.data, context);
    return ApiResponse.success(
      { recorded: true },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (!(error instanceof AppError)) {
      logger.error("qr.unhandled", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
    return ApiResponse.failure(error);
  }
}
