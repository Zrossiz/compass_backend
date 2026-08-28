import type { UserWithJwtTokens } from 'app/model/user';

export interface IUserService {
  registration(username: string, password: string): Promise<UserWithJwtTokens>;
  login(username: string, password: string): Promise<UserWithJwtTokens>;
}
