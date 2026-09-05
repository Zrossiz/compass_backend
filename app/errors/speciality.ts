export class SpecialityAlreadyExistsError extends Error {
  constructor() {
    super('Speciality already exist');
    this.name = 'SpecialityAlreadyExistsError';
  }
}
