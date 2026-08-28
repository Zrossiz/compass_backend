import 'module-alias/register';
import { createApp } from 'app/app';
import { logger } from 'app/app';

const main = async (): Promise<void> => {
  try {
    await createApp();
  } catch (err: unknown) {
    logger.fatal({ err }, 'Failed to start server');
    process.exitCode = 1;
  }
};

main();
