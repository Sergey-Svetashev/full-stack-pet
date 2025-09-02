export class ApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly cause?: Error
  ) {
    super(`${statusCode} | Error: ${message} ${cause ? `caused by ${cause.message}` : ""}`);
  }
}
