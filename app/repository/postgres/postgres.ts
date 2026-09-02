import type { PostgresConfig } from 'app/config/config';
import type {
  IProfessionInterviewRepository,
  IRepository,
  ISpecialityInterviewRepository,
  ISpecialityRepository,
  ISpecialityTrackRepository,
  ISpecialityUniversityRepository,
  IUniversityRepository,
} from 'app/repository/postgres/interface';
import { UserRepo } from 'app/repository/postgres/user';
import knex, { type Knex } from 'knex';
import { ProfessionRepo } from 'app/repository/postgres/profession';
import { ProfessionInterviewRepo } from 'app/repository/postgres/professionInterview';
import { SpecialityRepo } from 'app/repository/postgres/speciality';
import { SpecialityInterviewRepo } from 'app/repository/postgres/specialityInterview';
import { UniversityRepo } from 'app/repository/postgres/university';
import { SpecialityTrackRepo } from 'app/repository/postgres/specialityTrack';
import { SpecialityUniversityRepo } from 'app/repository/postgres/specialityUniversity';

export type PgConnection = Knex;

export const newPgConn = async (cfg: PostgresConfig): Promise<PgConnection> => {
  const conn = knex({
    client: 'pg',
    connection: {
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.dbName,
    },
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    },
  });

  await conn.raw('select 1');

  return conn;
};

export class Postgres implements IRepository {
  readonly user: UserRepo;
  readonly profession: ProfessionRepo;
  readonly professionInterview: IProfessionInterviewRepository;
  readonly speciality: ISpecialityRepository;
  readonly specialityInterview: ISpecialityInterviewRepository;
  readonly specialityTrack: ISpecialityTrackRepository;
  readonly university: IUniversityRepository;
  readonly specialityUniversity: ISpecialityUniversityRepository;

  constructor(private readonly connection: PgConnection) {
    this.user = new UserRepo(connection);
    this.profession = new ProfessionRepo(connection);
    this.professionInterview = new ProfessionInterviewRepo(connection);
    this.speciality = new SpecialityRepo(connection);
    this.specialityInterview = new SpecialityInterviewRepo(connection);
    this.university = new UniversityRepo(connection);
    this.specialityTrack = new SpecialityTrackRepo(connection);
    this.specialityUniversity = new SpecialityUniversityRepo(connection);
  }

  transaction<T>(handler: (trx: Knex.Transaction) => Promise<T>): Promise<T> {
    return this.connection.transaction(handler);
  }
}
