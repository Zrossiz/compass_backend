import { UserWithJwtTokens } from 'app/model/user';
import { JwtTokens } from 'app/model/user';
import { Profession } from 'app/model/profession';
import { PaginatedResult, Pagination } from 'app/types/pagination';

export interface IUserService {
  registration(username: string, password: string): Promise<UserWithJwtTokens>;
  login(username: string, password: string): Promise<UserWithJwtTokens>;
  refresh(refreshToken: string): JwtTokens;
}

export interface IProfessionService {
  create(title: string, description: string): Promise<void>;
  getById(id: number): Promise<Profession | null>;
  search(pattern: string, pagination: Pagination): Promise<PaginatedResult<Profession>>;
}

export interface IService {
  readonly user: IUserService;
  readonly profession: IProfessionService;
}
