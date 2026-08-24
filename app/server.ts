import "module-alias/register";

import { app } from "app/app";
import { newConfig } from "app/config/config";
import { newPgConn, newPostgres, PgConnection } from "app/repository/postgres";
import { newLogger } from "app/logger/logger";
import { Server } from "node:http";

const config = newConfig();

export const logger = newLogger(config.app.logger);

let pgConn: PgConnection | null;
let isShuttingDown = false;

const main = async (): Promise<void> => {
  try {
    pgConn = await newPgConn(config.pg);
    const pgRepo = newPostgres(pgConn);

    const server = app.listen(config.app.port, config.app.host, () => {
      logger.info(`Server is running at ${config.app.host}:${config.app.port}`);
    });

    process.once("SIGINT", () => void shutdown("SIGINT", server));
    process.once("SIGTERM", () => void shutdown("SIGTERM", server));
  } catch (error) {
    if (pgConn) {
      await pgConn.destroy();
    }
    throw error;
  }
};

const shutdown = async (
  signal: NodeJS.Signals,
  server: Server,
): Promise<void> => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ signal }, "Graceful shutdown started");

  try {
    server.close();
  } catch (error: unknown) {
    logger.error({ error }, "Failed to close HTTP server");
    process.exitCode = 1;
  }

  try {
    if (pgConn) {
      await pgConn.destroy();
    }
  } catch (error: unknown) {
    logger.error({ error }, "Failed to close PostgreSQL connection");
    process.exitCode = 1;
  }

  logger.info("Graceful shutdown completed");
};

main().catch((error: unknown) => {
  logger.fatal({ error }, "Failed to start server");
  process.exitCode = 1;
});
