import type { NextFunction, Request, Response } from "express";
import type { IUserService } from "app/service/service";
import { UsernameAlreadyExistsError } from "app/errors/user";
import { UserDTO } from "./dto/user";

export class UserHandler {
  constructor(private readonly userService: IUserService) {}

  registration = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const parsed = UserDTO.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid registration data",
        details: parsed.error,
      });
      return;
    }

    try {
      const user = await this.userService.registration(
        parsed.data.username,
        parsed.data.password,
      );

      res.status(201).json({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      });
    } catch (error: unknown) {
      if (error instanceof UsernameAlreadyExistsError) {
        res.status(409).json({ error: error.message });
        return;
      }
      next(error);
    }
  };
}
