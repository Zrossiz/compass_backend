import { Speciality } from 'app/model/speciality';
import { ISpecialityRepository } from 'app/repository/postgres/interface';
import { PaginatedResult, Pagination } from 'app/types/pagination';
import { CreateSpecialityDTO } from 'app/types/speciality';
import { Knex } from 'knex';

type SpecialityRow = {
  id: number;
  profession_id: number;
  title: string;
  description: string;
  created_at: Date;
};

export class SpecialityRepo implements ISpecialityRepository {
  constructor(private readonly pgConn: Knex) {}

  async create(payload: CreateSpecialityDTO): Promise<void> {
    await this.pgConn('specialities').insert({
      profession_id: payload.professionId,
      title: payload.title,
      description: payload.description,
    });
  }

  async search(
    pattern: string,
    pagination: Pagination,
  ): Promise<PaginatedResult<Speciality>> {
    const searchPattern = pattern.trim();

    const match = `%${searchPattern}%`;
    const applySearch = (query: Knex.QueryBuilder) =>
      query.where((builder) => {
        builder.whereILike('title', match).orWhereILike('description', match);
      });

    const [rows, countRow] = await Promise.all([
      applySearch(this.pgConn<SpecialityRow>('specialities'))
        .select('id', 'profession_id', 'title', 'description', 'created_at')
        .orderBy('id')
        .limit(pagination.limit)
        .offset(pagination.offset),
      applySearch(this.pgConn('specialities'))
        .count<{ total: string }>({ total: '*' })
        .first(),
    ]);

    const total = Number(countRow?.total ?? 0);

    return {
      items: rows.map(this.toSpeciality),
      totalPages: Math.ceil(total / pagination.limit),
    };
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
