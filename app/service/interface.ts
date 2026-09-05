import { UserWithJwtTokens } from 'app/model/user';
import { JwtTokens } from 'app/model/user';
import { Profession } from 'app/model/profession';
import { PaginatedResult, Pagination } from 'app/types/pagination';
import { CreateSpecialityDTO } from 'app/types/speciality';
import { Speciality } from 'app/model/speciality';
import { CreateProfessionInterviewDTO } from 'app/types/professionInterview';
import { ProfessionInterview } from 'app/model/professionInterview';
import { CreateSpecialityInterviewDTO } from 'app/types/specialityInterview';
import { SpecialityInterview } from 'app/model/specialityInterview';
import { University } from 'app/model/university';

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

export interface IProfessionInterviewService {
  create(payload: CreateProfessionInterviewDTO): Promise<void>;
  getAllByProfessionId(id: number): Promise<ProfessionInterview[]>;
}

export interface ISpecialityInterviewService {
  create(payload: CreateSpecialityInterviewDTO): Promise<void>;
  getAllBySpecialityId(id: number): Promise<SpecialityInterview[]>;
}

export interface ISpecialityService {
  create(payload: CreateSpecialityDTO): Promise<void>;
  search(pattern: string, professionId: number | null, pagination: Pagination): Promise<PaginatedResult<Speciality>>;
  getById(id: number): Promise<Speciality | null>;
}

export interface IUniversityService {
  create(title: string, region: string): Promise<void>;
  getAllBySpecialityId(id: number): Promise<University[]>;
}

export interface IService {
  readonly user: IUserService;
  readonly profession: IProfessionService;
  readonly professionInterview: IProfessionInterviewService;
  readonly speciality: ISpecialityService;
  readonly specialityInterview: ISpecialityInterviewService;
  readonly university: IUniversityService;
}
