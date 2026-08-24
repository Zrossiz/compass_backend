export type Config = {
  pg: PostgresConfig;
  app: AppConfig;
};

export type PostgresConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};

export type AppConfig = {
  host: string;
  port: number;
  logger: string;
};

export const newConfig = (): Config => {
  const pgConfig: PostgresConfig = {
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? "postgres",
    password: process.env.POSTGRES_PASSWORD ?? "",
    dbName: process.env.POSTGRES_DB ?? "compass",
  };

  const appConfig: AppConfig = {
    host: process.env.APP_HOST ?? "localhost",
    port: Number(process.env.APP_PORT ?? 9000),
    logger: process.env.LOGGER_LEVEL ?? "info",
  };

  const config: Config = {
    pg: pgConfig,
    app: appConfig,
  };

  return config;
};
