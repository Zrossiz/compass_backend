import type { User } from "app/model/user";
import type { UserRepository } from "app/repository/repository";
import type { IUserService } from "./service";
import bcrypt from "bcrypt";
import { isUniqueViolation } from "app/helpers/isUniqueViolation";
import { UsernameAlreadyExistsError } from "app/errors/user";

export class UserService implements IUserService {
  constructor(private readonly users: UserRepository) {}

  async registration(username: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 12);

    try {
      return await this.users.create(username, passwordHash);
    } catch (err: unknown) {
      if (isUniqueViolation(err)) {
        throw new UsernameAlreadyExistsError();
      }
      throw err;
    }
  }
}
