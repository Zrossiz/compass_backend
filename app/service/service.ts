import type { JwtTokens, UserWithJwtTokens } from 'app/model/user';
import type { Profession } from 'app/model/profession';

export interface IUserService {
  registration(username: string, password: string): Promise<UserWithJwtTokens>;
  login(username: string, password: string): Promise<UserWithJwtTokens>;
  refresh(refreshToken: string): JwtTokens;
}

export interface IProfessionService {
  create(title: string, description: string): Promise<void>;
  getById(id: number): Promise<Profession | null>;
}
