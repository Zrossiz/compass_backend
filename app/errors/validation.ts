export class InvalidBodyError extends Error {
  constructor() {
    super('Invalid request body');
    this.name = 'InvalidBodyError';
  }
}

export class InvalidQueryParams extends Error {
  constructor() {
    super('Invalid query params');
    this.name = 'InvalidQueryParams';
  }
}
