import express from 'express';
import { Handler } from 'app/handler/handler';
import cookieParser from 'cookie-parser';
import { newConfig } from 'app/config/config';
import { newLogger } from 'app/logger/logger';
import { newPgConn } from 'app/repository/postgres';
import { PgConnection, Postgres } from 'app/repository/postgres';
import { Server } from 'node:http';
import { Service } from 'app/service/service';

const config = newConfig();

export const logger = newLogger(config.app.logger);

let pgConn: PgConnection | null;
let isShuttingDown = false;

export const createApp = async () => {
  try {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    pgConn = await newPgConn(config.pg);

    const pgRepo = new Postgres(pgConn);
    const service = new Service(pgRepo, config);
    const handler = new Handler(app, service, config);
    handler.registerRoutes();
    handler.registerMiddleware();

    const server = app.listen(config.app.port, config.app.host, () => {
      logger.info(`Server is running at ${config.app.host}:${config.app.port}`);
    });

    process.once('SIGINT', () => void shutdown('SIGINT', server));
    process.once('SIGTERM', () => void shutdown('SIGTERM', server));

    return app;
  } catch (err: unknown) {
    if (pgConn) {
      await pgConn.destroy();
    }
    throw err;
  }
};

const shutdown = async (signal: NodeJS.Signals, server: Server): Promise<void> => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ signal }, 'Graceful shutdown started');

  try {
    server.close();
  } catch (error: unknown) {
    logger.error({ error }, 'Failed to close HTTP server');
    process.exitCode = 1;
  }

  try {
    if (pgConn) {
      await pgConn.destroy();
    }
  } catch (error: unknown) {
    logger.error({ error }, 'Failed to close PostgreSQL connection');
    process.exitCode = 1;
  }

  logger.info('Graceful shutdown completed');
};
