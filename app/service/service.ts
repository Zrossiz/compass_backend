import type { User } from "app/model/user";

export interface IUserService {
  registration(username: string, password: string): Promise<User>;
}
