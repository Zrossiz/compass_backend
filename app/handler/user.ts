import type { NextFunction, Request, Response } from 'express';
import type { IUserService } from 'app/service/service';
import { UsernameAlreadyExistsError } from 'app/errors/user';
import { InvalidBodyError } from 'app/errors/validation';
import { UserDTO, UserRes } from './dto/user';

export class UserHandler {
  constructor(private readonly userService: IUserService) {}

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

      res.status(201).json(loginRes);
    } catch (err) {
      next(err);
    }
  };
}
