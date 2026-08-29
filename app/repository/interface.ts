import type { User } from 'app/model/user';
import type { Profession } from 'app/model/profession';
import { Pagination } from 'app/types/pagination';
import { CreateProfessionInterviewDTO } from 'app/types/professionInterview';
import { ProfessionInterview } from 'app/model/professionInterview';
import { CreateSpecialityDTO } from 'app/types/speciality';
import { Speciality } from 'app/model/speciality';
import { SpecialityInterview } from 'app/model/specialityInterview';
import { CreateSpecialityInterviewDTO } from 'app/types/specialityInterview';

export interface IRepository {
  readonly users: IUserRepository;
  readonly professions: IProfessionRepository;
  readonly professionInterviews: IProfessionInterviewRepository;
  readonly speciality: ISpecialityRepository;
  readonly specialityInterviews: ISpecialityInterviewRepository;
}

export interface IUserRepository {
  create(username: string, password: string): Promise<User>;
  getByUsername(username: string): Promise<User | null>;
}

export interface IProfessionRepository {
  create(title: string, description: string): Promise<void>;
  getById(id: number): Promise<Profession | null>;
  search(pattern: string, pagination: Pagination): Promise<Profession[]>;
}

export interface IProfessionInterviewRepository {
  create(payload: CreateProfessionInterviewDTO): Promise<void>;
  getAllByProfessionId(id: number): Promise<ProfessionInterview[]>;
}

export interface ISpecialityInterviewRepository {
  create(payload: CreateSpecialityInterviewDTO): Promise<void>;
  getAllBySpecialityId(id: number): Promise<SpecialityInterview[]>;
}

export interface ISpecialityRepository {
  create(payload: CreateSpecialityDTO): Promise<void>;
  search(pattern: string, pagination: Pagination): Promise<Speciality[]>;
}
