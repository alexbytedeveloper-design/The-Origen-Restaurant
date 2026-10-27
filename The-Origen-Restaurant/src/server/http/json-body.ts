import { AppError } from "@/server/core/app-error";

export class JsonBodyReader {
  public static async read(request: Request, maxBytes = 8 * 1024): Promise<unknown> {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      throw AppError.validation("Content-Type must be application/json.");
    }

    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
      throw AppError.validation("Request body is too large.");
    }

    const text = await request.text();
    if (new TextEncoder().encode(text).length > maxBytes) {
      throw AppError.validation("Request body is too large.");
    }
    if (text.trim().length === 0) {
      throw AppError.validation("Request body is required.");
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw AppError.validation("Request body must be valid JSON.");
    }
  }
}
