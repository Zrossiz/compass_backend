export type Config = {
  pg: PostgresConfig;
  app: AppConfig;
  s3: S3Config;
};

export type S3Config = {
  host: string;
  port: number;
  useSsl: boolean;
  accessKey: string;
  secretKey: string;
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
  env: string;
  jwt: JwtConfig;
};

export type JwtConfig = {
  accessLifetime: string;
  accessSecret: string;
  refreshLifetime: string;
  refreshSecret: string;
};

export const newConfig = (): Config => {
  const pgConfig: PostgresConfig = {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? '',
    dbName: process.env.POSTGRES_DB ?? 'compass',
  };

  const appConfig: AppConfig = {
    host: process.env.APP_HOST ?? 'localhost',
    env: process.env.APP_ENV ?? 'dev',
    port: Number(process.env.APP_PORT ?? 9000),
    logger: process.env.LOGGER_LEVEL ?? 'info',
    jwt: {
      accessLifetime: process.env.ACCESS_LIFETIME ?? '5m',
      accessSecret: process.env.ACCESS_SECRET ?? '',
      refreshLifetime: process.env.REFRESH_LIFETIME ?? '24h',
      refreshSecret: process.env.REFRESH_SECRET ?? '',
    },
  };

  const s3Config: S3Config = {
    host: process.env.MINIO_HOST ?? 'minio',
    port: Number(process.env.MINIO_PORT ?? 9000),
    useSsl: Boolean(process.env.MINIO_SSL ?? false),
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'access',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'secret',
  };

  if (appConfig.env === 'production') {
    if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
      throw new Error('JWT secrets are required in production');
    }
  }

  const config: Config = {
    pg: pgConfig,
    app: appConfig,
    s3: s3Config,
  };

  return config;
};
