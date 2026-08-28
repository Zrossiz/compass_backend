import type { CookieOptions, NextFunction, Request, Response } from 'express';
import type { IUserService } from 'app/service/service';
import { UnauthorizedError, UsernameAlreadyExistsError } from 'app/errors/user';
import { InvalidBodyError } from 'app/errors/validation';
import type { JwtTokens } from 'app/model/user';
import { UserDTO, UserRes } from './dto/user';
import { AppConfig } from 'app/config/config';

export class UserHandler {
  constructor(
    private readonly userService: IUserService,
    private readonly appCfg: AppConfig,
  ) {}

  registration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UserDTO.safeParse(req.body);
    if (!parsed.success) {
      throw new InvalidBodyError();
    }

    try {
      const userWithTokens = await this.userService.registration(
        parsed.data.username,
        parsed.data.password,
      );

      const registrationRes: UserRes = {
        id: userWithTokens.user.id,
        username: userWithTokens.user.username,
        createdAt: userWithTokens.user.createdAt,
      };

      this.setAuthCookies(res, userWithTokens.tokens);
      res.status(201).json(registrationRes);
    } catch (err: unknown) {
      if (err instanceof UsernameAlreadyExistsError) {
        res.status(409).json({ error: err.message });
        return;
      }
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = UserDTO.safeParse(req.body);
    if (!parsed.success) {
      throw new InvalidBodyError();
    }

    try {
      const userWithTokens = await this.userService.login(
        parsed.data.username,
        parsed.data.password,
      );

      const loginRes: UserRes = {
        id: userWithTokens.user.id,
        username: userWithTokens.user.username,
        createdAt: userWithTokens.user.createdAt,
      };

      this.setAuthCookies(res, userWithTokens.tokens);
      res.status(200).json(loginRes);
    } catch (err) {
      next(err);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies['refreshToken'];

      if (refreshToken == "" || typeof refreshToken != "string") {
        throw new UnauthorizedError()
      };

      const tokens = this.userService.refresh(refreshToken);

      this.setAuthCookies(res, tokens);

      res.status(200).json();
    } catch (err) {
      next(err)
    }
  }

  private setAuthCookies(res: Response, tokens: JwtTokens): void {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: this.appCfg.env === 'production',
      sameSite: 'lax',
      path: '/',
    };

    res.cookie('accessToken', tokens.access, cookieOptions);
    res.cookie('refreshToken', tokens.refresh, cookieOptions);
  }
}
