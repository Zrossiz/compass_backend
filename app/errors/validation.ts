export class InvalidBodyError extends Error {
  constructor() {
    super("Invalid request body");
    this.name = "InvalidBodyError";
  }
}
