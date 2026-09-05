import { SpecialityAlreadyExistsError } from 'app/errors/speciality';
import { Speciality } from 'app/model/speciality';
import { ISpecialityRepository } from 'app/repository/postgres/interface';
import { PaginatedResult, Pagination } from 'app/types/pagination';
import { CreateSpecialityDTO } from 'app/types/speciality';
import { Knex } from 'knex';
import { isUniquePgErrViolation } from 'app/helpers/isUniqueViolation';

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
    try {
      await this.pgConn('specialities').insert({
        profession_id: payload.professionId,
        title: payload.title,
        description: payload.description,
      });
    } catch (err: unknown) {
      if (isUniquePgErrViolation(err)) {
        throw new SpecialityAlreadyExistsError();
      }
    }
  }

  async search(
    pattern: string,
    professionId: number | null,
    pagination: Pagination,
  ): Promise<PaginatedResult<Speciality>> {
    const searchPattern = pattern.trim();
    const match = `%${searchPattern}%`;

    const applySearch = (query: Knex.QueryBuilder) =>
      query.where((builder) => {
        if (professionId !== null) {
          builder.andWhere('profession_id', professionId);
        }

        if (searchPattern) {
          builder.andWhere((searchBuilder) => {
            searchBuilder
              .whereILike('title', match)
              .orWhereILike('description', match);
          });
        }
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

  async getById(id: number): Promise<Speciality | null> {
    const row = await this.pgConn<SpecialityRow>('specialities')
      .select('id', 'profession_id', 'title', 'description', 'created_at')
      .where({ id })
      .first();
    return row ? this.toSpeciality(row) : null;
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
