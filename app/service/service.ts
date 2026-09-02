import { UserService } from 'app/service/user';
import { Config } from 'app/config/config';
import { IRepository } from 'app/repository/postgres/interface';
import { IMinio } from 'app/repository/s3/interface';
import { IService } from 'app/service/interface';
import { ProfessionService } from './profession';

export class Service implements IService {
  readonly user: UserService;
  readonly profession: ProfessionService;

  constructor(
    private readonly pgRepo: IRepository,
    private readonly s3Client: IMinio,
    private readonly cfg: Config,
  ) {
    this.user = new UserService(pgRepo.user, cfg);
    this.profession = new ProfessionService(pgRepo.profession);
  }
}
