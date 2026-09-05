import type { Express } from 'express';
import { UserHandler } from 'app/handler/user';
import { IService } from 'app/service/interface';
import { Config } from 'app/config/config';
import { errorMiddleware } from 'app/middleware/error';
import { ProfessionHandler } from 'app/handler/profession';
import { authMiddleware } from 'app/middleware/auth';
import { SpecialityHandler } from 'app/handler/speciality';
import { ProfessionInterviewHandler } from 'app/handler/professionInterview';
import { SpecialityInterviewHandler } from 'app/handler/specialityInterview';
import { UniversityHandler } from 'app/handler/university';
import { SpecialityTrackHandler } from 'app/handler/specialityTrack';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export class Handler {
  private app: Express;
  private userHandler: UserHandler;
  private professionHandler: ProfessionHandler;
  private professionInterviewHandler: ProfessionInterviewHandler;
  private specialityHandler: SpecialityHandler;
  private specialityInterviewHandler: SpecialityInterviewHandler;
  private universityHandler: UniversityHandler;
  private specialityTrackHandler: SpecialityTrackHandler;

  constructor(
    expressApp: Express,
    private service: IService,
    private cfg: Config,
  ) {
    this.app = expressApp;
    this.userHandler = new UserHandler(this.service.user, this.cfg.app);
    this.professionHandler = new ProfessionHandler(this.service.profession);
    this.professionInterviewHandler = new ProfessionInterviewHandler(this.service.professionInterview);
    this.specialityHandler = new SpecialityHandler(this.service.speciality);
    this.specialityInterviewHandler = new SpecialityInterviewHandler(this.service.specialityInterview);
    this.universityHandler = new UniversityHandler(this.service.university);
    this.specialityTrackHandler = new SpecialityTrackHandler(this.service.specialityTrack);
  }

  registerRoutes() {
    const jwtConfig = this.cfg.app.jwt;

    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    this.app.post('/api/v1/users/register', this.userHandler.registration);
    this.app.post('/api/v1/users/login', this.userHandler.login);
    this.app.post('/api/v1/users/refresh', this.userHandler.refresh);

    this.app.post('/api/v1/professions', authMiddleware(jwtConfig), this.professionHandler.create);
    this.app.get('/api/v1/professions', this.professionHandler.find);
    this.app.get('/api/v1/professions/:id', this.professionHandler.getById);

    this.app.post('/api/v1/profession-interview', authMiddleware(jwtConfig), this.professionInterviewHandler.create);
    this.app.get('/api/v1/profession-interview/profession/:id', this.professionInterviewHandler.getAllByProfessionId);

    this.app.post('/api/v1/specialities', authMiddleware(jwtConfig), this.specialityHandler.create);
    this.app.get('/api/v1/specialities', this.specialityHandler.find);
    this.app.get('/api/v1/specialities/:id', this.specialityHandler.getById);

    this.app.post('/api/v1/speciality-interview', authMiddleware(jwtConfig), this.specialityInterviewHandler.create);
    this.app.get('/api/v1/speciality-interview/speciality/:id', this.specialityInterviewHandler.getAllBySpecialityId);

    this.app.post('/api/v1/university', authMiddleware(jwtConfig), this.universityHandler.create);
    this.app.get('/api/v1/university/speciality/:id', this.universityHandler.getAllBySpecialityId);

    this.app.post(
      '/api/v1/speciality-track',
      authMiddleware(jwtConfig),
      upload.single('file'),
      this.specialityTrackHandler.create,
    );
    this.app.get('/api/v1/speciality-track', this.specialityTrackHandler.getAllBySpecialityId);
  }

  registerMiddleware() {
    this.app.use(errorMiddleware);
  }
}
