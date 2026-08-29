import { ProfessionInterview } from 'app/model/professionInterview';
import { IProfessionInterviewRepository } from 'app/repository/interface';
import { CreateProfessionInterviewDTO } from 'app/types/professionInterview';
import { Knex } from 'knex';

type ProfessionInterviewRow = {
  id: number;
  profession_id: number;
  title: string;
  video_link: string;
  sort_order: number;
};

export class ProfessionInterviewRepo implements IProfessionInterviewRepository {
  constructor(private readonly pgConn: Knex) {}

  async create(payload: CreateProfessionInterviewDTO): Promise<void> {
    await this.pgConn('profession_interviews').insert({
      profession_id: payload.professionId,
      title: payload.title,
      link: payload.videoLink,
      sort_order: payload.order,
    });
  }

  async getAllByProfessionId(id: number): Promise<ProfessionInterview[]> {
    const rows = await this.pgConn<ProfessionInterviewRow>('profession_interviews')
      .select('id', 'profession_id', 'title', 'link', 'order')
      .where('profession_id', id)
      .orderBy('sort_order', 'desc');

    return rows.map(this.toProfessionInterview);
  }

  toProfessionInterview(row: ProfessionInterviewRow): ProfessionInterview {
    const professionInterview: ProfessionInterview = {
      id: row.id,
      professionId: row.profession_id,
      title: row.title,
      videoLink: row.video_link,
      sortOrder: row.sort_order,
    };

    return professionInterview;
  }
}
