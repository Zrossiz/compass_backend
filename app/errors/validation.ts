export class InvalidBodyError extends Error {
  constructor() {
    super('Invalid request body');
    this.name = 'InvalidBodyError';
  }
}

export class InvlidQueryParams extends Error {
  constructor() {
    super('Invlid query params');
    this.name = 'InvlidQueryParams';
  }
}
