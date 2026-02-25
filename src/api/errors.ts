export class X84ApiError extends Error {
  constructor(
    readonly status: number,
    readonly statusText: string,
    readonly body: unknown,
  ) {
    super(`X84 API error ${status} ${statusText}`);
    this.name = "X84ApiError";
  }
}
