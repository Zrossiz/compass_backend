export class UsernameAlreadyExistsError extends Error {
  constructor() {
    super("Username is already taken");
    this.name = "UsernameAlreadyExistsError";
  }
}