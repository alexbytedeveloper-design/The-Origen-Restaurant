import { AppError } from "@/server/core/app-error";

export interface ApiFailure {
  readonly ok: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly fields?: Readonly<Record<string, string>>;
    readonly retryAfterSeconds?: number;
  };
}

export class ApiResponse {
  public static success<T>(data: T, init: ResponseInit = {}): Response {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json; charset=utf-8");
    headers.set("X-Content-Type-Options", "nosniff");
    return new Response(JSON.stringify({ ok: true, data }), { ...init, headers });
  }

  public static failure(error: unknown): Response {
    const appError = error instanceof AppError ? error : AppError.internal();
    const body: ApiFailure = {
      ok: false,
      error: {
        code: appError.code,
        message: appError.message,
        ...(appError.fields ? { fields: appError.fields } : {}),
        ...(appError.retryAfterSeconds
          ? { retryAfterSeconds: appError.retryAfterSeconds }
          : {}),
      },
    };
    const headers = new Headers({ "Cache-Control": "no-store" });
    if (appError.retryAfterSeconds) {
      headers.set("Retry-After", String(appError.retryAfterSeconds));
    }
    return new Response(JSON.stringify(body), { status: appError.status, headers });
  }
}
