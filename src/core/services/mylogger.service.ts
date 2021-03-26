import { LoggerService } from "@nestjs/common";

export class MyLoggerService implements LoggerService {
  private readonly context: string;

  constructor(context: string, transport?) {
    this.context = context || "";
  }

  log(message: string): void {
    const currentDate = new Date();
    console.log(
      `[LOG] - ${this.context} - ${currentDate.toISOString()} - ${message}`
    );
  }

  error(message: string, trace?: any): void {
    const currentDate = new Date();
    console.error(
      `[ERROR] - ${this.context} - ${currentDate.toISOString} - (${
        trace || "trace not provided !"
      }) - ${message}`
    );
  }

  warn(message: string, apiDescription?: string): void {
    const currentDate = new Date();
    console.warn(
      `[WARN] - ${this.context} - ${currentDate.toISOString()} - ${
        apiDescription || ""
      } - ${message}`
    );
  }
}
