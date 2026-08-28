import { IProfessionRepository } from 'app/repository/repository';
import { Profession } from 'app/model/profession';
import { Knex } from 'knex';

type ProfessionRow = {
  id: number;
  title: string;
  description: string;
  created_at: Date;
};

export class ProfessionRepo implements IProfessionRepository {
  constructor(private readonly pgConn: Knex) {}

  async create(title: string, description: string): Promise<void> {
    await this.pgConn<ProfessionRow>('professions').insert({
      title,
      description,
    });
  }

  async getById(id: number): Promise<Profession | null> {
    const row = await this.pgConn<ProfessionRow>('professions').where({ id }).first();
    return row ? this.toProfession(row) : null;
  }

  private toProfession = (row: ProfessionRow): Profession => ({
    id: row.id,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
  });
}
