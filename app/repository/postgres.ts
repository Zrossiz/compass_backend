import type { PostgresConfig } from 'app/config/config';
import type {
  IProfessionInterviewRepository,
  IRepository,
  ISpecialityInterviewRepository,
  ISpecialityRepository,
  ISpecialityTrackRepository,
  ISpecialityUniversityRepository,
  IUniversityRepository,
} from 'app/repository/interface';
import { UserRepo } from 'app/repository/user';
import knex, { type Knex } from 'knex';
import { ProfessionRepo } from 'app/repository/profession';
import { ProfessionInterviewRepo } from 'app/repository/professionInterview';
import { SpecialityRepo } from 'app/repository/speciality';
import { SpecialityInterviewRepo } from 'app/repository/specialityInterview';
import { UniversityRepo } from 'app/repository/university';
import { SpecialityTrackRepo } from 'app/repository/specialityTrack';
import { SpecialityUniversityRepo } from 'app/repository/specialityUniversity';

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
  readonly users: UserRepo;
  readonly professions: ProfessionRepo;
  readonly professionInterviews: IProfessionInterviewRepository;
  readonly speciality: ISpecialityRepository;
  readonly specialityInterviews: ISpecialityInterviewRepository;
  readonly specialityTrack: ISpecialityTrackRepository;
  readonly university: IUniversityRepository;
  readonly specialityUniversity: ISpecialityUniversityRepository;

  constructor(private readonly connection: PgConnection) {
    this.users = new UserRepo(connection);
    this.professions = new ProfessionRepo(connection);
    this.professionInterviews = new ProfessionInterviewRepo(connection);
    this.speciality = new SpecialityRepo(connection);
    this.specialityInterviews = new SpecialityInterviewRepo(connection);
    this.university = new UniversityRepo(connection);
    this.specialityTrack = new SpecialityTrackRepo(connection);
    this.specialityUniversity = new SpecialityUniversityRepo(connection);
  }

  transaction<T>(handler: (trx: Knex.Transaction) => Promise<T>): Promise<T> {
    return this.connection.transaction(handler);
  }
}
