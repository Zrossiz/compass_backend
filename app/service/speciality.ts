import { ISpecialityRepository } from 'app/repository/postgres/interface';
import { ISpecialityService } from 'app/service/interface';
import { CreateSpecialityDTO } from 'app/types/speciality';
import { Speciality } from 'app/model/speciality';
import { Pagination, PaginatedResult } from 'app/types/pagination';

export class SpecialityService implements ISpecialityService {
  constructor(private readonly specialityRepo: ISpecialityRepository) {}

  async create(payload: CreateSpecialityDTO): Promise<void> {
    await this.specialityRepo.create(payload);
  }

  async search(
    pattern: string,
    professionId: number | null,
    pagination: Pagination,
  ): Promise<PaginatedResult<Speciality>> {
    return this.specialityRepo.search(pattern, professionId, pagination);
  }

  async getById(id: number): Promise<Speciality | null> {
    return await this.specialityRepo.getById(id);
  }
}
