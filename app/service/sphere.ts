import { ISphereRepository } from 'app/repository/postgres/interface';
import { ISphereService } from './interface';
import { Sphere } from 'app/model/sphere';

export class SphereService implements ISphereService {
  constructor(private readonly sphereRepo: ISphereRepository) {}

  async deleteById(id: number): Promise<boolean> {
    return this.sphereRepo.deleteById(id);
  }

  async create(title: string, description: string): Promise<void> {
    await this.sphereRepo.create(title, description);
  }

  async getAll(): Promise<Sphere[]> {
    return this.sphereRepo.getAll();
  }
}
