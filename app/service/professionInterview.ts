import { ProfessionInterview } from 'app/model/professionInterview';
import { IProfessionInterviewRepository } from 'app/repository/postgres/interface';
import { IProfessionInterviewService } from 'app/service/interface';
import { CreateProfessionInterviewDTO } from 'app/types/professionInterview';

export class ProfessionInterviewService implements IProfessionInterviewService {
  constructor(private readonly professionInterviewRepo: IProfessionInterviewRepository) {}

  async create(payload: CreateProfessionInterviewDTO): Promise<void> {
    await this.professionInterviewRepo.create(payload);
  }

  async getAllByProfessionId(id: number): Promise<ProfessionInterview[]> {
    return await this.professionInterviewRepo.getAllByProfessionId(id);
  }
}
