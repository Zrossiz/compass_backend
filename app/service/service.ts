import type { JwtTokens, UserWithJwtTokens } from 'app/model/user';
import type { Profession } from 'app/model/profession';
import { UserService } from 'app/service/user';
import { Config } from 'app/config/config';
import { IRepository } from 'app/repository/interface';

export interface IUserService {
  registration(username: string, password: string): Promise<UserWithJwtTokens>;
  login(username: string, password: string): Promise<UserWithJwtTokens>;
  refresh(refreshToken: string): JwtTokens;
}

export interface IProfessionService {
  create(title: string, description: string): Promise<void>;
  getById(id: number): Promise<Profession | null>;
}

export interface IService {
  readonly users: IUserService;
}

export class Service implements IService {
  readonly users: UserService;

  constructor(
    private readonly pgRepo: IRepository,
    private readonly cfg: Config,
  ) {
    this.users = new UserService(pgRepo.users, cfg);
  }
}
