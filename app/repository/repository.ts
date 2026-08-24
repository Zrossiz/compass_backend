import type { User } from "app/model/user";

export interface UserRepository {
  create(username: string, password: string): Promise<User>;
  getByUsername(username: string): Promise<User | null>;
}

export interface Repository {
  readonly users: UserRepository;
}
