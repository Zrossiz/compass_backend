import type { JwtTokens, UserJWTPayload, UserWithJwtTokens } from 'app/model/user';
import type { IUserRepository } from 'app/repository/postgres/interface';
import type { IUserService } from 'app/service/interface';
import bcrypt from 'bcrypt';
import { isUniquePgErrViolation } from 'app/helpers/isUniqueViolation';
import {
  InvalidUsernameOrPassword,
  UnauthorizedError,
  UsernameAlreadyExistsError,
  UserNotFoundError,
} from 'app/errors/user';
import { Config } from 'app/config/config';
import jwt, { type SignOptions } from 'jsonwebtoken';

export class UserService implements IUserService {
  constructor(
    private readonly usersRepo: IUserRepository,
    private readonly cfg: Config,
  ) {}

  async registration(username: string, password: string): Promise<UserWithJwtTokens> {
    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await this.usersRepo.create(username, passwordHash);

      const jwtPayload: UserJWTPayload = {
        id: user.id,
        username: user.username,
      };
      const tokens = this.generateTokens(jwtPayload);

      const res: UserWithJwtTokens = { user, tokens };

      return res;
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
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new InvalidUsernameOrPassword();
    }

    const jwtPayload: UserJWTPayload = {
      id: user.id,
      username: user.username,
    };
    const tokens = this.generateTokens(jwtPayload);

    const res: UserWithJwtTokens = {
      user,
      tokens,
    };

    return res;
  }

  refresh(refreshToken: string): JwtTokens {
    let decoded: jwt.JwtPayload | string;

    try {
      decoded = jwt.verify(refreshToken, this.cfg.app.jwt.refreshSecret);
    } catch (err: unknown) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError();
      }
      throw err;
    }

    if (
      typeof decoded === 'string' ||
      typeof decoded.id !== 'number' ||
      typeof decoded.username !== 'string'
    ) {
      throw new UnauthorizedError();
    }

    const jwtPayload: UserJWTPayload = {
      id: decoded.id,
      username: decoded.username,
    };

    return this.generateTokens(jwtPayload);
  }

  private generateTokens(user: UserJWTPayload): JwtTokens {
    const accessOptions: SignOptions = {
      expiresIn: this.cfg.app.jwt.accessLifetime as SignOptions['expiresIn'],
    };
    const refreshOptions: SignOptions = {
      expiresIn: this.cfg.app.jwt.refreshLifetime as SignOptions['expiresIn'],
    };

    const tokens: JwtTokens = {
      access: jwt.sign(user, this.cfg.app.jwt.accessSecret, accessOptions),
      refresh: jwt.sign(user, this.cfg.app.jwt.refreshSecret, refreshOptions),
    };

    return tokens;
  }
}
