import { University } from 'app/model/university';
import { IUniversityRepository } from 'app/repository/postgres/interface';
import { CreateUniversityDTO } from 'app/types/university';
import { Knex } from 'knex';

type UniversityRow = {
  id: number;
  title: string;
  region: string;
  description: string;
  created_at: Date;
  link_id?: number;
};

export class UniversityRepo implements IUniversityRepository {
  constructor(private readonly pgConn: Knex) {}

  async deleteById(id: number): Promise<boolean> {
    const deletedCount = await this.pgConn('universities').where({ id }).del();
    return deletedCount > 0;
  }

  async create(payload: CreateUniversityDTO): Promise<void> {
    await this.pgConn('universities').insert({
      title: payload.title,
      region: payload.region,
      description: payload.description,
    });
  }

  async update(id: number, payload: CreateUniversityDTO): Promise<void> {
    await this.pgConn('universities').where({ id }).update({
      title: payload.title,
      region: payload.region,
      description: payload.description,
      updated_at: new Date(),
    });
  }

  async getAll(): Promise<University[]> {
    const rows = await this.pgConn<UniversityRow>('universities')
      .select('id', 'title', 'region', 'description', 'created_at')
      .orderBy('title');
    return rows.map(this.toUniversity);
  }

  async getAllBySpecialityId(id: number): Promise<University[]> {
    const rows = await this.pgConn<UniversityRow>('universities')
      .select(
        'universities.id',
        'universities.title',
        'universities.region',
        'universities.description',
        'universities.created_at',
        'speciality_universities.id as link_id',
      )
      .innerJoin('speciality_universities', 'universities.id', 'speciality_universities.university_id')
      .where('speciality_universities.speciality_id', id)
      .orderBy('universities.id');

    return rows.map(this.toUniversity);
  }

  toUniversity(row: UniversityRow): University {
    const university: University = {
      id: row.id,
      title: row.title,
      region: row.region,
      description: row.description,
      ...(row.link_id !== undefined ? { linkId: row.link_id } : {}),
      createdAt: row.created_at,
    };

    return university;
  }
}
