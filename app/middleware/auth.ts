import type { NextFunction, Request, Response } from 'express';
import type { JwtConfig } from 'app/config/config';
import { UnauthorizedError } from 'app/errors/user';
import jwt from 'jsonwebtoken';

export const authMiddleware = (jwtConfig: JwtConfig) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const accessToken: unknown = req.cookies?.accessToken;

    if (typeof accessToken !== 'string' || accessToken.length === 0) {
      next(new UnauthorizedError());
      return;
    }

    try {
      const decoded = jwt.verify(accessToken, jwtConfig.accessSecret);

      if (typeof decoded === 'string' || typeof decoded.id !== 'number' || typeof decoded.username !== 'string') {
        next(new UnauthorizedError());
        return;
      }

      req.user = {
        id: decoded.id,
        username: decoded.username,
      };
      next();
    } catch (err: unknown) {
      if (err instanceof jwt.JsonWebTokenError) {
        next(new UnauthorizedError());
        return;
      }
      next(err);
    }
  };
};
