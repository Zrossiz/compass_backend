import { Speciality } from 'app/model/speciality';
import { ISpecialityRepository } from 'app/repository/interface';
import { Pagination } from 'app/types/pagination';
import { CreateSpecialityDTO } from 'app/types/speciality';
import { Knex } from 'knex';

type SpecialityRow = {
  id: number;
  profession_id: number;
  title: string;
  description: string;
  created_at: Date;
};

export class SpecialityInterview implements ISpecialityRepository {
  constructor(private readonly pgConn: Knex) {}

  async create(payload: CreateSpecialityDTO): Promise<void> {
    await this.pgConn('specialities').insert({
      profession_id: payload.professionId,
      title: payload.title,
      description: payload.description,
    });
  }

  async search(pattern: string, pagination: Pagination): Promise<Speciality[]> {
    const searchPattern = pattern.trim();

    if (!searchPattern) {
      return [];
    }

    const rows = await this.pgConn<SpecialityRow>('specialities')
      .select('id', 'profession_id', 'title', 'description', 'created_at')
      .whereILike('title', `%${searchPattern}%`)
      .orWhereILike('description', `%${searchPattern}%`)
      .orderBy('id')
      .limit(pagination.limit)
      .offset(pagination.offset);

    return rows.map(this.toSpeciality);
  }

  toSpeciality(row: SpecialityRow): Speciality {
    const speciality: Speciality = {
      id: row.id,
      professionId: row.profession_id,
      title: row.title,
      description: row.description,
      createdAt: row.created_at,
    };

    return speciality;
  }
}
