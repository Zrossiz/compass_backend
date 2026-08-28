import type { UserWithJwtTokens, JwtTokens, User, UserJWTPayload } from "app/model/user";
import type { UserRepository } from "app/repository/repository";
import type { IUserService } from "./service";
import bcrypt from "bcrypt";
import { isUniquePgErrViolation } from "app/helpers/isUniqueViolation";
import { InvalidUsernameOrPassword, UsernameAlreadyExistsError, UserNotFoundError } from "app/errors/user";
import { Config } from "app/config/config";
import jwt, { type SignOptions } from "jsonwebtoken";

export class UserService implements IUserService {
  constructor(private readonly usersRepo: UserRepository, private readonly cfg: Config) {}

  async registration(username: string, password: string): Promise<UserWithJwtTokens> {
    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await this.usersRepo.create(username, passwordHash);
      const tokens = this.generateTokens(user)

      const res: UserWithJwtTokens = { user, tokens }

      return res
    } catch (err: unknown) {
      if (isUniquePgErrViolation(err)) {
        throw new UsernameAlreadyExistsError();
      }
      throw err;
    }
  }

  async login(username: string, password: string): Promise<UserWithJwtTokens> {
    const user = await this.usersRepo.getByUsername(username);
    if (!user) {
      throw new UserNotFoundError();
    };

    const isMatch = await bcrypt.compare(password, user?.password)
    if (!isMatch) {
      throw new InvalidUsernameOrPassword();
    };

    const tokens = this.generateTokens(user);

    const res: UserWithJwtTokens = {
      user,
      tokens
    };

    return res;
  }

  private generateTokens(user: User): JwtTokens {
    const payload: UserJWTPayload = {
      id: user.id,
      username: user.username,
    }

    const accessOptions: SignOptions = {
      expiresIn: this.cfg.app.jwt.accessLifetime as SignOptions["expiresIn"],
    };
    const refreshOptions: SignOptions = {
      expiresIn: this.cfg.app.jwt.refreshLifetime as SignOptions["expiresIn"],
    };

    const tokens: JwtTokens = {
      access: jwt.sign(payload, this.cfg.app.jwt.accessSecret, accessOptions),
      refresh: jwt.sign(payload, this.cfg.app.jwt.refreshSecret, refreshOptions),
    }

    return tokens
  }
}
