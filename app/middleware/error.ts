import { logger } from 'app/app';
import { UnauthorizedError } from 'app/errors/user';
import type { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next;

  if (error instanceof UnauthorizedError) {
    res.status(401).json({ error: error.message });
    return;
  }

  logger.error({ error }, 'internal server error');

  res.status(500).json({ error: 'Internal server error' });
};
