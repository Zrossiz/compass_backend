import type { User } from 'app/model/user';
import type { Profession } from 'app/model/profession';
import { PaginatedResult, Pagination } from 'app/types/pagination';
import { CreateProfessionInterviewDTO } from 'app/types/professionInterview';
import { ProfessionInterview } from 'app/model/professionInterview';
import { CreateSpecialityDTO } from 'app/types/speciality';
import { Speciality } from 'app/model/speciality';
import { SpecialityInterview } from 'app/model/specialityInterview';
import { CreateSpecialityInterviewDTO } from 'app/types/specialityInterview';
import { University } from 'app/model/university';
import { CreateSpecialityTrackDTO } from 'app/types/specialityTrack';
import { SpecialityTrack } from 'app/model/specialityTrack';
import { CreateUniversityDTO } from 'app/types/university';
import { Sphere } from 'app/model/sphere';

export interface IRepository {
  readonly user: IUserRepository;
  readonly profession: IProfessionRepository;
  readonly professionInterview: IProfessionInterviewRepository;
  readonly speciality: ISpecialityRepository;
  readonly specialityInterview: ISpecialityInterviewRepository;
  readonly specialityTrack: ISpecialityTrackRepository;
  readonly university: IUniversityRepository;
  readonly specialityUniversity: ISpecialityUniversityRepository;
  readonly sphere: ISphereRepository;
}

export interface IUserRepository {
  deleteById(id: number): Promise<boolean>;
  create(username: string, password: string): Promise<User>;
  getByUsername(username: string): Promise<User | null>;
}

export interface IProfessionRepository {
  deleteById(id: number): Promise<boolean>;
  create(sphereId: number, title: string, description: string): Promise<void>;
  getById(id: number): Promise<Profession | null>;
  search(pattern: string, sphereId: number, pagination: Pagination): Promise<PaginatedResult<Profession>>;
}

export interface IProfessionInterviewRepository {
  deleteById(id: number): Promise<boolean>;
  create(payload: CreateProfessionInterviewDTO): Promise<void>;
  getAllByProfessionId(id: number): Promise<ProfessionInterview[]>;
}

export interface ISpecialityInterviewRepository {
  deleteById(id: number): Promise<boolean>;
  create(payload: CreateSpecialityInterviewDTO): Promise<void>;
  getAllBySpecialityId(id: number): Promise<SpecialityInterview[]>;
}

export interface ISpecialityRepository {
  deleteById(id: number): Promise<boolean>;
  create(payload: CreateSpecialityDTO): Promise<void>;
  search(pattern: string, professionId: number | null, pagination: Pagination): Promise<PaginatedResult<Speciality>>;
  getById(id: number): Promise<Speciality | null>;
}

export interface ISpecialityTrackRepository {
  deleteById(id: number): Promise<boolean>;
  create(payload: CreateSpecialityTrackDTO): Promise<void>;
  getAllBySpecialityId(id: number): Promise<SpecialityTrack[]>;
}

export interface IUniversityRepository {
  deleteById(id: number): Promise<boolean>;
  create(payload: CreateUniversityDTO): Promise<void>;
  getAllBySpecialityId(id: number): Promise<University[]>;
}

export interface ISpecialityUniversityRepository {
  deleteById(id: number): Promise<boolean>;
  create(specialityId: number, universityId: number): Promise<void>;
}

export interface ISphereRepository {
  deleteById(id: number): Promise<boolean>;
  create(title: string, description: string): Promise<void>;
  getAll(): Promise<Sphere[]>;
}
