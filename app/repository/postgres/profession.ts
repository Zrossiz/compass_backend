import { IProfessionRepository } from 'app/repository/postgres/interface';
import { Profession } from 'app/model/profession';
import { Knex } from 'knex';
import { PaginatedResult, Pagination } from 'app/types/pagination';
import { ProfessionAlreadyExistsError } from 'app/errors/profession';
import { isUniquePgErrViolation } from 'app/helpers/isUniqueViolation';

type ProfessionRow = {
  id: number;
  title: string;
  description: string;
  created_at: Date;
};

export class ProfessionRepo implements IProfessionRepository {
  constructor(private readonly pgConn: Knex) {}

  async search(pattern: string, pagination: Pagination): Promise<PaginatedResult<Profession>> {
    const searchPattern = pattern.trim();

    if (!searchPattern) {
      return { items: [], totalPages: 0 };
    }

    const match = `%${searchPattern}%`;
    const applySearch = (query: Knex.QueryBuilder) =>
      query.where((builder) => {
        builder.whereILike('title', match).orWhereILike('description', match);
      });

    const [rows, countRow] = await Promise.all([
      applySearch(this.pgConn<ProfessionRow>('professions'))
        .select('id', 'title', 'description', 'created_at')
        .orderBy('id')
        .limit(pagination.limit)
        .offset(pagination.offset),
      applySearch(this.pgConn('professions')).count<{ total: string }>({ total: '*' }).first(),
    ]);

    const total = Number(countRow?.total ?? 0);

    return {
      items: rows.map(this.toProfession),
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async create(title: string, description: string): Promise<void> {
    try {
      await this.pgConn('professions').insert({
        title,
        description,
      });
    } catch (err: unknown) {
      if (isUniquePgErrViolation(err)) {
        throw new ProfessionAlreadyExistsError();
      }
    }
  }

  async getById(id: number): Promise<Profession | null> {
    const row = await this.pgConn<ProfessionRow>('professions')
      .select('id', 'title', 'description', 'created_at')
      .where({ id })
      .first();
    return row ? this.toProfession(row) : null;
  }

  private toProfession = (row: ProfessionRow): Profession => ({
    id: row.id,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
  });
}
