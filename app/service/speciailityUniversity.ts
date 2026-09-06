import { ISpecialityUniversityRepository } from 'app/repository/postgres/interface';
import { ISpecialityUniversityService } from 'app/service/interface';

export class SpecialityUniversityService implements ISpecialityUniversityService {
  constructor(private readonly specialityUniversityRepo: ISpecialityUniversityRepository) {}

  async create(specialityId: number, universityId: number): Promise<void> {
    await this.specialityUniversityRepo.create(specialityId, universityId);
  }
}
