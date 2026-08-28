import type { User } from 'app/model/user';
import type { Profession } from 'app/model/profession';

export interface IUserRepository {
  create(username: string, password: string): Promise<User>;
  getByUsername(username: string): Promise<User | null>;
}

export interface IProfessionRepository {
  create(title: string, description: string): Promise<void>;
  getById(id: number): Promise<Profession | null>;
}

export interface Repository {
  readonly users: IUserRepository;
  readonly professions: IProfessionRepository;
}
