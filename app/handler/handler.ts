import type { Express } from 'express';
import { UserHandler } from 'app/handler/user';
import { IService } from 'app/service/interface';
import { Config } from 'app/config/config';
import { errorMiddleware } from 'app/middleware/error';
import { ProfessionHandler } from 'app/handler/profession';
import { authMiddleware } from 'app/middleware/auth';

export class Handler {
  private app: Express;
  private userHandler: UserHandler;
  private professionHandler: ProfessionHandler;

  constructor(
    expressApp: Express,
    private service: IService,
    private cfg: Config,
  ) {
    this.app = expressApp;
    this.userHandler = new UserHandler(this.service.user, this.cfg.app);
    this.professionHandler = new ProfessionHandler(this.service.profession);
  }

  registerRoutes() {
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    this.app.post('/api/v1/users/register', this.userHandler.registration);
    this.app.post('/api/v1/users/login', this.userHandler.login);
    this.app.post('/api/v1/users/refresh', this.userHandler.refresh);

    this.app.post(
      '/api/v1/professions',
      authMiddleware(this.cfg.app.jwt),
      this.professionHandler.create,
    );
    this.app.get('/api/v1/professions', this.professionHandler.find);
    this.app.get('/api/v1/:id', this.professionHandler.getById);
  }

  registerMiddleware() {
    this.app.use(errorMiddleware);
  }
}
