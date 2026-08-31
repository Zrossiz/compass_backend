import { SpecialityTrack } from 'app/model/specialityTrack';
import { ISpecialityTrackRepository } from 'app/repository/interface';
import { CreateSpecialityTrackDTO } from 'app/types/specialityTrack';
import { Knex } from 'knex';

type SpecialityTrackRow = {
  id: number;
  speciality_id: number;
  title: string;
  image_link: string;
  sort_order: string;
  created_at: Date;
};

export class SpecialityTrackRepo implements ISpecialityTrackRepository {
  constructor(private readonly pgConn: Knex) {}

  async create(payload: CreateSpecialityTrackDTO): Promise<void> {
    await this.pgConn('speciality_tracks').insert({
      speciality_id: payload.specialityId,
      title: payload.title,
      image_link: payload.imageLink,
      sort_order: payload.sortOrder,
    });
  }

  async getAllBySpecialityId(id: number): Promise<SpecialityTrack[]> {
    const rows = await this.pgConn<SpecialityTrackRow>('speciality_tracks')
      .select('id', 'speciality_id', 'title', 'image_link', 'sort_order', 'created_at')
      .where('speciality_id', id)
      .orderBy('sort_order', 'desc');

    return rows.map(this.toSpecialityTrack);
  }

  toSpecialityTrack(row: SpecialityTrackRow): SpecialityTrack {
    const specialityTrack: SpecialityTrack = {
      id: row.id,
      specialityId: row.speciality_id,
      title: row.title,
      imageLink: row.image_link,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
    };

    return specialityTrack;
  }
}
