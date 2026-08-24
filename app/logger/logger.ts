import pino from "pino";

export const newLogger = (level: string) => {
  return pino({
    level,
  });
};
