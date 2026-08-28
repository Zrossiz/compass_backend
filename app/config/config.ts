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
  jwt: JwtConfig;
};

export type JwtConfig = {
  accessLifetime: string;
  accessSecret: string;
  refreshLifetime: string;
  refreshSecret: string;
}

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
    jwt: {
      accessLifetime: process.env.ACCESS_LIFETIME ?? "5m",
      accessSecret: process.env.ACCESS_SECRET ?? "123MKLas",
      refreshLifetime: process.env.REFRESH_LIFETIME ?? "24h",
      refreshSecret: process.env.REFRESH_SECRET ?? "123MKLas123",
    }
  };

  const config: Config = {
    pg: pgConfig,
    app: appConfig,
  };

  return config;
};
