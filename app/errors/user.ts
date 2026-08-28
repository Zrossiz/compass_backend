export class UsernameAlreadyExistsError extends Error {
  constructor() {
    super('Username is already taken');
    this.name = 'UsernameAlreadyExistsError';
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundError';
  }
}

export class InvalidUsernameOrPassword extends Error {
  constructor() {
    super('Invalid username or password');
    this.name = 'InvalidUsernameOrPassword';
  }
}
