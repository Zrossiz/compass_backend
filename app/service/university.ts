import { University } from 'app/model/university';
import { IUniversityRepository } from 'app/repository/postgres/interface';
import { IUniversityService } from 'app/service/interface';

export class UniversityService implements IUniversityService {
  constructor(private readonly universityRepo: IUniversityRepository) {}

  async create(title: string, region: string): Promise<void> {
    await this.universityRepo.create(title, region);
  }

  async getAllBySpecialityId(id: number): Promise<University[]> {
    return await this.getAllBySpecialityId(id);
  }
}
