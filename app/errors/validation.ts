export class InvalidBodyError extends Error {
  constructor(err: string) {
    super('Invalid request body');
    this.name = 'InvalidBodyError';
    this.message = String(err);
  }
}

export class InvalidQueryParams extends Error {
  constructor(err: string) {
    super('Invalid query params');
    this.name = 'InvalidQueryParams';
    this.message = String(err);
  }
}
