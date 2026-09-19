import { ISphereService } from 'app/service/interface';
import { NextFunction, Request, Response } from 'express';
import { SphereDTO } from './dto/sphere';
import { InvalidBodyError, InvalidQueryParams } from 'app/errors/validation';

import { parseIdParam } from 'app/handler/helper';
import { SphereAlreadyExistsError } from 'app/errors/sphere';

export class SphereHandler {
  constructor(private readonly sphereService: ISphereService) {}

  deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseIdParam(req);
      const deleted = await this.sphereService.deleteById(id);

      if (!deleted) {
        res.status(404).json();
        return;
      }

      res.status(204).send();
    } catch (err: unknown) {
      if (err instanceof InvalidQueryParams) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = SphereDTO.safeParse(req.body);
      if (!parsed.success) {
        throw new InvalidBodyError();
      }

      await this.sphereService.create(parsed.data.title, parsed.data.description);

      res.status(201).json();
    } catch (err: unknown) {
      if (err instanceof InvalidBodyError) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (err instanceof SphereAlreadyExistsError) {
        res.status(409).json({ error: err.message });
        return;
      }

      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const spheres = await this.sphereService.getAll();

      res.status(200).json(spheres);
    } catch (err: unknown) {
      next(err);
    }
  };
}
