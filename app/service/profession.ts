import { Profession } from 'app/model/profession';
import { IProfessionRepository } from 'app/repository/postgres/interface';
import { IProfessionService } from 'app/service/interface';
import { PaginatedResult, Pagination } from 'app/types/pagination';
import { CreateProfessionDTO } from 'app/types/profession';

export class ProfessionService implements IProfessionService {
  constructor(private readonly professionsRepo: IProfessionRepository) {}

  async deleteById(id: number): Promise<boolean> {
    return await this.professionsRepo.deleteById(id);
  }

  async create(sphereId: number, title: string, description: string): Promise<void> {
    await this.professionsRepo.create(sphereId, title, description);
  }

  async getById(id: number): Promise<Profession | null> {
    return await this.professionsRepo.getById(id);
  }

  async search(pattern: string, pagination: Pagination, sphereId?: number): Promise<PaginatedResult<Profession>> {
    return await this.professionsRepo.search(pattern, pagination, sphereId);
  }

  async update(id: number, payload: CreateProfessionDTO): Promise<void> {
    await this.professionsRepo.update(id, payload);
  }
}
