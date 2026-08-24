import path from "node:path";
import { parseArgs } from "node:util";
import knex from "knex";

type DbConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};

const config = {
  options: {
    action: { type: 'string', short: 'a' },
  },
} as const;

const init = async () => {
  const cfg: DbConfig = {
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT) ?? 5432,
    user: process.env.POSTGRES_USER ?? "postgres",
    password: process.env.POSTGRES_PASSWORD ?? "",
    dbName: process.env.POSTGRES_DB ?? "compass",
  }

  const conn = knex({
    client: "pg",
    connection: {
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.dbName,
    },
    migrations: {
      directory: path.resolve("dist/migrations/postgres"),
    },
  })

  try {
    const { values } = parseArgs(config);

    switch (values.action) {
      case "up":
        await conn.migrate.up()
        break
      case "down":
        await conn.migrate.down()
        break
      case "latest":
        await conn.migrate.latest()
      case undefined:
      case "":
        console.log("-a cannot be empty")
        return
      default:
        console.log("possible actions is: up or down")
        return
    }

    console.log("successful migration")
  } catch (err: unknown) {
    console.log(err)
  } finally {
    await conn.destroy()
  }
}

init()
