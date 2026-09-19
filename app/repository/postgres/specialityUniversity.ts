import { ISpecialityUniversityRepository } from 'app/repository/postgres/interface';
import { Knex } from 'knex';

export class SpecialityUniversityRepo implements ISpecialityUniversityRepository {
  constructor(private readonly pgConn: Knex) {}

  async deleteById(id: number): Promise<boolean> {
    const deletedCount = await this.pgConn('speciality_universities').where({ id }).del();
    return deletedCount > 0;
  }

  async create(specialityId: number, universityId: number): Promise<void> {
    await this.pgConn('speciality_universities').insert({
      speciality_id: specialityId,
      university_id: universityId,
    });
  }
}
