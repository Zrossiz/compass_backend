import { ISpecialityUniversityRepository } from 'app/repository/postgres/interface';
import { Knex } from 'knex';

export class SpecialityUniversityRepo implements ISpecialityUniversityRepository {
  constructor(private readonly pgConn: Knex) {}

  async create(specialityId: number, universityId: number): Promise<void> {
    await this.pgConn('speciality_universities').insert({
      speciality_id: specialityId,
      university_id: universityId,
    });
  }
}
