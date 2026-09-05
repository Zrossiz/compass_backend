import { SpecialityInterview } from 'app/model/specialityInterview';
import { ISpecialityInterviewRepository } from 'app/repository/postgres/interface';
import { ISpecialityInterviewService } from 'app/service/interface';
import { CreateSpecialityInterviewDTO } from 'app/types/specialityInterview';

export class SpecialityInterviewService implements ISpecialityInterviewService {
  constructor(private readonly specialityInterviewRepo: ISpecialityInterviewRepository) {}

  async create(payload: CreateSpecialityInterviewDTO): Promise<void> {
    await this.specialityInterviewRepo.create(payload);
  }

  async getAllBySpecialityId(id: number): Promise<SpecialityInterview[]> {
    return await this.specialityInterviewRepo.getAllBySpecialityId(id);
  }
}
