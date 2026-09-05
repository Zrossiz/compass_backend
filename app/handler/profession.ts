import { IProfessionService } from 'app/service/interface';
import { NextFunction, Request, Response } from 'express';
import { ProfessionDTO } from 'app/handler/dto/profession';
import { InvalidBodyError, InvalidQueryParams } from 'app/errors/validation';
import { ProfessionAlreadyExistsError } from 'app/errors/profession';
import { buildPagination } from 'app/handler/helper';

export class ProfessionHandler {
  constructor(private readonly professionService: IProfessionService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = ProfessionDTO.safeParse(req.body);
      if (!parsed.success) {
        throw new InvalidBodyError();
      }

      await this.professionService.create(parsed.data.title, parsed.data.description);

      res.status(201).json();
    } catch (err: unknown) {
      if (err instanceof InvalidBodyError) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (err instanceof ProfessionAlreadyExistsError) {
        res.status(409).json({ error: err.message });
        return;
      }
      next(err);
    }
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchPattern = req.query.search;
      const pagination = buildPagination(req);

      const paginatedProfessions = await this.professionService.search(String(searchPattern ?? ''), pagination);

      res.status(200).json(paginatedProfessions);
    } catch (err) {
      if (err instanceof InvalidQueryParams) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const professionId = Number(req.params.id);

      if (!Number.isInteger(professionId) || professionId <= 0) {
        throw new InvalidBodyError();
      }

      const profession = await this.professionService.getById(professionId);

      if (!profession) {
        res.status(404).json();
        return;
      }

      res.status(200).json(profession);
    } catch (err) {
      if (err instanceof InvalidBodyError) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  }
}
