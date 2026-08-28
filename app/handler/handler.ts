import type { Express } from 'express';
import { UserHandler } from './user';

export class Handler {
  private app: Express;
  private userHandler: UserHandler;

  constructor(expressApp: Express, usrHandler: UserHandler) {
    this.userHandler = usrHandler;
    this.app = expressApp;
  }

  registerRoutes() {
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    this.app.post('/api/v1/users/register', this.userHandler.registration);
    this.app.post('/api/v1/users/login', this.userHandler.login);
    this.app.post('/api/v1/users/refresh', this.userHandler.refresh);
  }
}
