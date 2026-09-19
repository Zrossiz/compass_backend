import { Sphere } from 'app/model/sphere';
import { ISphereRepository } from 'app/repository/postgres/interface';
import { Knex } from 'knex';
import { SphereAlreadyExistsError } from 'app/errors/sphere';
import { isUniquePgErrViolation } from 'app/helpers/isUniqueViolation';

type SphereRow = {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
};

export class SphereRepo implements ISphereRepository {
  constructor(private readonly pgConn: Knex) {}

  async deleteById(id: number): Promise<boolean> {
    const deletedCount = await this.pgConn('spheres').where({ id }).del();
    return deletedCount > 0;
  }

  async create(title: string, description: string): Promise<void> {
    try {
      await this.pgConn('spheres').insert({ title, description });
    } catch (err: unknown) {
      if (isUniquePgErrViolation(err)) {
        throw new SphereAlreadyExistsError();
      }
      throw err;
    }
  }

  async getAll(): Promise<Sphere[]> {
    const rows = await this.pgConn<SphereRow>('spheres')
      .select('id', 'title', 'description', 'created_at', 'updated_at')
      .orderBy('id');

    return rows.map(this.toSphere);
  }

  toSphere(row: SphereRow): Sphere {
    const sphere: Sphere = {
      id: row.id,
      title: row.title,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return sphere;
  }
}
