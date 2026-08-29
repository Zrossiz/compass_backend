import type { PostgresConfig } from 'app/config/config';
import type {
  IProfessionInterviewRepository,
  IRepository,
  ISpecialityInterviewRepository,
  ISpecialityRepository,
} from 'app/repository/interface';
import { UserRepo } from 'app/repository/user';
import knex, { type Knex } from 'knex';
import { ProfessionRepo } from 'app/repository/profession';
import { ProfessionInterviewRepo } from 'app/repository/professionInterview';
import { SpecialityInterview } from 'app/repository/speciality';
import { SpecialityInterviewRepo } from 'app/repository/specialityInterview';

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

  constructor(private readonly connection: PgConnection) {
    this.users = new UserRepo(connection);
    this.professions = new ProfessionRepo(connection);
    this.professionInterviews = new ProfessionInterviewRepo(connection);
    this.speciality = new SpecialityInterview(connection);
    this.specialityInterviews = new SpecialityInterviewRepo(connection);
  }

  transaction<T>(handler: (trx: Knex.Transaction) => Promise<T>): Promise<T> {
    return this.connection.transaction(handler);
  }
}
