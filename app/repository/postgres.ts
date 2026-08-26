import type { PostgresConfig } from "app/config/config";
import type { Repository } from "app/repository/repository";
import { UserRepo } from "app/repository/user";
import knex, { type Knex } from "knex";

export type PgConnection = Knex;

export const newPgConn = async (cfg: PostgresConfig): Promise<PgConnection> => {
  const conn = knex({
    client: "pg",
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

  await conn.raw("select 1");

  return conn;
};

export class Postgres implements Repository {
  readonly users: UserRepo;

  constructor(private readonly connection: PgConnection) {
    this.users = new UserRepo(connection);
  }

  transaction<T>(handler: (trx: Knex.Transaction) => Promise<T>): Promise<T> {
    return this.connection.transaction(handler);
  }
}
