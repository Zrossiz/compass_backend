import { IProfessionRepository } from 'app/repository/interface';
import { Profession } from 'app/model/profession';
import { Knex } from 'knex';
import { Pagination } from 'app/types/pagination';

type ProfessionRow = {
  id: number;
  title: string;
  description: string;
  created_at: Date;
};

export class ProfessionRepo implements IProfessionRepository {
  constructor(private readonly pgConn: Knex) {}

  async search(pattern: string, pagination: Pagination): Promise<Profession[]> {
    const searchPattern = pattern.trim();

    if (!searchPattern) {
      return [];
    }

    const rows = await this.pgConn<ProfessionRow>('professions')
      .select('id', 'title', 'description', 'created_at')
      .whereILike('title', `%${searchPattern}%`)
      .orWhereILike('description', `%${searchPattern}%`)
      .orderBy('id')
      .limit(pagination.limit)
      .offset(pagination.offset);

    return rows.map(this.toProfession);
  }

  async create(title: string, description: string): Promise<void> {
    await this.pgConn('professions').insert({
      title,
      description,
    });
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
