export class GenericError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string = "",
    cause?: unknown
  ) {
    super(message, { cause });
  }
}
