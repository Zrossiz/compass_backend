import { UserHandler } from "app/handler/user";
import type { Repository } from "app/repository/repository";
import { UserService } from "app/service/user";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { Handler } from "app/handler/handler";

export const createApp = (repository: Repository) => {
  const app = express();
  const userHandler = new UserHandler(new UserService(repository.users));

  app.use(express.json());

  const handler = new Handler(app, userHandler);
  handler.registerRoutes();

  app.use(
    (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
      void error;
      void _next;
      res.status(500).json({ error: "Internal server error" });
    },
  );

  return app;
};
