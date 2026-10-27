type LogPayload = Readonly<Record<string, unknown>>;

export class StructuredLogger {
  public info(event: string, payload: LogPayload = {}): void {
    this.write("info", event, payload);
  }

  public warn(event: string, payload: LogPayload = {}): void {
    this.write("warn", event, payload);
  }

  public error(event: string, payload: LogPayload = {}): void {
    this.write("error", event, payload);
  }

  private write(level: "info" | "warn" | "error", event: string, payload: LogPayload): void {
    const entry = {
      level,
      event,
      at: new Date().toISOString(),
      ...payload,
    };
    const serialized = JSON.stringify(entry);
    if (level === "error") {
      console.error(serialized);
      return;
    }
    if (level === "warn") {
      console.warn(serialized);
      return;
    }
    console.info(serialized);
  }
}

export const logger = new StructuredLogger();
