import { UserService } from 'app/service/user';
import { Config } from 'app/config/config';
import { IRepository } from 'app/repository/postgres/interface';
import { IMinio } from 'app/repository/s3/interface';
import { IService } from 'app/service/interface';

export class Service implements IService {
  readonly users: UserService;

  constructor(
    private readonly pgRepo: IRepository,
    private readonly s3Client: IMinio,
    private readonly cfg: Config,
  ) {
    this.users = new UserService(pgRepo.users, cfg);
  }
}
