import { UserService } from 'app/service/user';
import { Config } from 'app/config/config';
import { IRepository } from 'app/repository/postgres/interface';
import { IMinio } from 'app/repository/s3/interface';
import {
  IProfessionInterviewService,
  IService,
  ISpecialityService,
  IUserService,
  IProfessionService,
  ISpecialityInterviewService,
} from 'app/service/interface';
import { ProfessionService } from 'app/service/profession';
import { SpecialityService } from 'app/service/speciality';
import { ProfessionInterviewService } from 'app/service/professionInterview';
import { SpecialityInterviewService } from 'app/service/specialityInterview';

export class Service implements IService {
  readonly user: IUserService;
  readonly profession: IProfessionService;
  readonly professionInterview: IProfessionInterviewService;
  readonly speciality: ISpecialityService;
  readonly specialityInterview: ISpecialityInterviewService;

  constructor(
    private readonly pgRepo: IRepository,
    private readonly s3Client: IMinio,
    private readonly cfg: Config,
  ) {
    this.user = new UserService(pgRepo.user, cfg);
    this.profession = new ProfessionService(pgRepo.profession);
    this.speciality = new SpecialityService(pgRepo.speciality);
    this.professionInterview = new ProfessionInterviewService(pgRepo.professionInterview);
    this.specialityInterview = new SpecialityInterviewService(pgRepo.specialityInterview);
  }
}
