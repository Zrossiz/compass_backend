import { University } from 'app/model/university';
import { IUniversityRepository } from 'app/repository/postgres/interface';
import { IUniversityService } from 'app/service/interface';
import { CreateUniversityDTO } from 'app/types/university';

export class UniversityService implements IUniversityService {
  constructor(private readonly universityRepo: IUniversityRepository) {}

  async deleteById(id: number): Promise<boolean> {
    return await this.universityRepo.deleteById(id);
  }

  async create(payload: CreateUniversityDTO): Promise<void> {
    await this.universityRepo.create(payload);
  }

  async getAllBySpecialityId(id: number): Promise<University[]> {
    return await this.getAllBySpecialityId(id);
  }
}
