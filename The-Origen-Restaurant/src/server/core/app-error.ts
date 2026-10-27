export type AppErrorCode =
  | "VALIDATION"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "UNAVAILABLE"
  | "INTERNAL";

const STATUS_BY_CODE: Record<AppErrorCode, number> = {
  VALIDATION: 422,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  UNAVAILABLE: 503,
  INTERNAL: 500,
};

export class AppError extends Error {
  public readonly status: number;

  public constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly fields?: Readonly<Record<string, string>>,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "AppError";
    this.status = STATUS_BY_CODE[code];
  }

  public static validation(
    message: string,
    fields?: Readonly<Record<string, string>>,
  ): AppError {
    return new AppError("VALIDATION", message, fields);
  }

  public static forbidden(message = "Request origin is not allowed."): AppError {
    return new AppError("FORBIDDEN", message);
  }

  public static rateLimited(retryAfterSeconds: number): AppError {
    return new AppError(
      "RATE_LIMITED",
      "Too many requests. Please try again later.",
      undefined,
      Math.max(1, Math.ceil(retryAfterSeconds)),
    );
  }

  public static internal(message = "Unexpected error."): AppError {
    return new AppError("INTERNAL", message);
  }
}
