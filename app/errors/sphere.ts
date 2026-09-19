export class SphereAlreadyExistsError extends Error {
  constructor() {
    super('Sphere already exists');
    this.name = 'SphereAlreadyExistsError';
  }
}
