import type { Express } from 'express';
import { UserHandler } from 'app/handler/user';
import { IService } from 'app/service/service';
import { Config } from 'app/config/config';
import { errorMiddleware } from 'app/middleware/error';

export class Handler {
  private app: Express;
  private userHandler: UserHandler;

  constructor(
    expressApp: Express,
    private service: IService,
    private cfg: Config,
  ) {
    this.app = expressApp;
    this.userHandler = new UserHandler(this.service.users, this.cfg.app);
  }

  registerRoutes() {
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    this.app.post('/api/v1/users/register', this.userHandler.registration);
    this.app.post('/api/v1/users/login', this.userHandler.login);
    this.app.post('/api/v1/users/refresh', this.userHandler.refresh);
  }

  registerMiddleware() {
    this.app.use(errorMiddleware);
  }
}
