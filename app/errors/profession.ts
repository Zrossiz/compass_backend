export class ProfessionAlreadyExistsError extends Error {
  constructor() {
    super('Profession already exist');
    this.name = 'ProfessionAlreadyExistsError';
  }
}
