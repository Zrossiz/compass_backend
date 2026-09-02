import { ISpecialityInterviewRepository } from 'app/repository/postgres/interface';
import { Knex } from 'knex';
import { SpecialityInterview } from 'app/model/specialityInterview';
import { CreateSpecialityInterviewDTO } from 'app/types/specialityInterview';

type SpecialityInterviewRow = {
  id: number;
  speciality_id: number;
  title: string;
  video_link: string;
  sort_order: number;
};

export class SpecialityInterviewRepo implements ISpecialityInterviewRepository {
  constructor(private readonly pgConn: Knex) {}

  async create(payload: CreateSpecialityInterviewDTO): Promise<void> {
    await this.pgConn('speciality_interviews').insert({
      speciality_id: payload.specialityId,
      title: payload.title,
      video_link: payload.videoLink,
      sort_order: payload.order,
    });
  }

  async getAllBySpecialityId(id: number): Promise<SpecialityInterview[]> {
    const rows = await this.pgConn<SpecialityInterviewRow>('speciality_interviews')
      .select('id', 'speciality_id', 'title', 'video_link', 'sort_order')
      .where('speciality_id', id)
      .orderBy('sort_order', 'desc');

    return rows.map(this.toSpecialityInterview);
  }

  toSpecialityInterview(row: SpecialityInterviewRow): SpecialityInterview {
    const professionInterview: SpecialityInterview = {
      id: row.id,
      specialityId: row.speciality_id,
      title: row.title,
      videoLink: row.video_link,
      sortOrder: row.sort_order,
    };

    return professionInterview;
  }
}
