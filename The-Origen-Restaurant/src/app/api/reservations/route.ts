import { reservationSchema } from "@/domain/reservations/reservation.schema";
import { AppError } from "@/server/core/app-error";
import { logger } from "@/server/core/logger";
import { reservationService } from "@/server/domain/reservations/reservation.container";
import { ApiResponse } from "@/server/http/api-response";
import { JsonBodyReader } from "@/server/http/json-body";
import { RequestContext } from "@/server/http/request-context";
import { mapZodIssues } from "@/server/http/zod-fields";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const context = RequestContext.from(request);

  try {
    context.assertSameOrigin();
    const body = await JsonBodyReader.read(request, 8 * 1024);
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      throw AppError.validation(
        "Please review the reservation details.",
        mapZodIssues(parsed.error),
      );
    }

    const result = reservationService.submit(parsed.data, context);
    return ApiResponse.success(result, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const code = error instanceof AppError ? error.code : "INTERNAL";
    logger.warn("reservation.request_failed", {
      code,
      userAgentFamily: context.userAgentFamily,
    });

    if (!(error instanceof AppError)) {
      logger.error("reservation.unhandled", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return ApiResponse.failure(error);
  }
}
