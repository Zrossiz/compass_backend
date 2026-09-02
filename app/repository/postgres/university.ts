import { University } from 'app/model/university';
import { IUniversityRepository } from 'app/repository/postgres/interface';
import { Knex } from 'knex';

type UniversityRow = {
  id: number;
  title: string;
  region: string;
  created_at: Date;
};

export class UniversityRepo implements IUniversityRepository {
  constructor(private readonly pgConn: Knex) {}

  async create(title: string, region: string): Promise<void> {
    await this.pgConn('universities').insert({
      title,
      region,
    });
  }

  async getAllBySpecialityId(id: number): Promise<University[]> {
    const rows = await this.pgConn<UniversityRow>('universities')
      .select(
        'universities.id',
        'universities.title',
        'universities.region',
        'universities.created_at',
      )
      .innerJoin(
        'speciality_universities',
        'universities.id',
        'speciality_universities.university_id',
      )
      .where('speciality_universities.speciality_id', id)
      .orderBy('universities.id');

    return rows.map(this.toUniversity);
  }

  toUniversity(row: UniversityRow): University {
    const university: University = {
      id: row.id,
      title: row.title,
      region: row.region,
      createdAt: row.created_at,
    };

    return university;
  }
}
