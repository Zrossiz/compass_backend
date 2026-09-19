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
import { SpecialityTrack } from 'app/model/specialityTrack';
import { CreateSpecialityTrackDTO } from 'app/types/specialityTrack';
import { CreateUniversityDTO } from 'app/types/university';

export interface IUserService {
  deleteById(id: number): Promise<boolean>;
  registration(username: string, password: string): Promise<UserWithJwtTokens>;
  login(username: string, password: string): Promise<UserWithJwtTokens>;
  refresh(refreshToken: string): JwtTokens;
}

export interface IProfessionService {
  deleteById(id: number): Promise<boolean>;
  create(sphereId: number, title: string, description: string): Promise<void>;
  getById(id: number): Promise<Profession | null>;
  search(pattern: string, pagination: Pagination): Promise<PaginatedResult<Profession>>;
}

export interface IProfessionInterviewService {
  deleteById(id: number): Promise<boolean>;
  create(payload: CreateProfessionInterviewDTO): Promise<void>;
  getAllByProfessionId(id: number): Promise<ProfessionInterview[]>;
}

export interface ISpecialityInterviewService {
  deleteById(id: number): Promise<boolean>;
  create(payload: CreateSpecialityInterviewDTO): Promise<void>;
  getAllBySpecialityId(id: number): Promise<SpecialityInterview[]>;
}

export interface ISpecialityService {
  deleteById(id: number): Promise<boolean>;
  create(payload: CreateSpecialityDTO): Promise<void>;
  search(pattern: string, professionId: number | null, pagination: Pagination): Promise<PaginatedResult<Speciality>>;
  getById(id: number): Promise<Speciality | null>;
}

export interface IUniversityService {
  deleteById(id: number): Promise<boolean>;
  create(payload: CreateUniversityDTO): Promise<void>;
  getAllBySpecialityId(id: number): Promise<University[]>;
}

export interface ISpecialityTrackService {
  deleteById(id: number): Promise<boolean>;
  create(payload: CreateSpecialityTrackDTO, file: Express.Multer.File): Promise<void>;
  getAllBySpecialityId(id: number): Promise<SpecialityTrack[]>;
}

export interface ISpecialityUniversityService {
  deleteById(id: number): Promise<boolean>;
  create(specialityId: number, universityId: number): Promise<void>;
}

export interface IService {
  readonly user: IUserService;
  readonly profession: IProfessionService;
  readonly professionInterview: IProfessionInterviewService;
  readonly speciality: ISpecialityService;
  readonly specialityInterview: ISpecialityInterviewService;
  readonly university: IUniversityService;
  readonly specialityTrack: ISpecialityTrackService;
  readonly specialityUniversity: ISpecialityUniversityService;
}
