import 'module-alias/register';

import path from 'node:path';
import { parseArgs } from 'node:util';
import knex from 'knex';
import type { PostgresConfig } from 'app/config/config';

const config = {
  options: {
    action: { type: 'string', short: 'a' },
  },
} as const;

const init = async () => {
  const cfg: PostgresConfig = {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? '',
    dbName: process.env.POSTGRES_DB ?? 'compass',
  };

  const conn = knex({
    client: 'pg',
    connection: {
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.dbName,
    },
    migrations: {
      directory: path.resolve('dist/migrations/postgres'),
    },
  });

  try {
    const { values } = parseArgs(config);

    switch (values.action) {
      case 'up':
        await conn.migrate.up();
        break;
      case 'down':
        await conn.migrate.down();
        break;
      case 'latest':
        await conn.migrate.latest();
        break;
      case undefined:
      case '':
        console.error('-a cannot be empty');
        process.exitCode = 1;
        return;
      default:
        console.error('possible actions are: up, down or latest');
        process.exitCode = 1;
        return;
    }

    console.log('successful migration');
  } catch (err: unknown) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await conn.destroy();
  }
};

init();
