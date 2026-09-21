import { IProfessionService } from 'app/service/interface';
import { NextFunction, Request, Response } from 'express';
import { ProfessionDTO } from 'app/handler/dto/profession';
import { InvalidBodyError, InvalidQueryParams } from 'app/errors/validation';
import { ProfessionAlreadyExistsError } from 'app/errors/profession';
import { buildPagination, parseIdParam } from 'app/handler/helper';
import { SearchQueryDTO } from 'app/handler/dto/common';

export class ProfessionHandler {
  constructor(private readonly professionService: IProfessionService) {}

  deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseIdParam(req);
      const deleted = await this.professionService.deleteById(id);

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
      const parsed = ProfessionDTO.safeParse(req.body);
      if (!parsed.success) {
        throw new InvalidBodyError();
      }

      await this.professionService.create(parsed.data.sphereId, parsed.data.title, parsed.data.description);

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
  };

  find = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedQuery = SearchQueryDTO.safeParse(req.query);
      if (!parsedQuery.success) {
        throw new InvalidQueryParams();
      }

      const pagination = buildPagination(req);
      const paginatedProfessions = await this.professionService.search(
        parsedQuery.data.search,
        parsedQuery.data.sphereId,
        pagination,
      );
      paginatedProfessions.curPage = pagination.page;

      res.status(200).json(paginatedProfessions);
    } catch (err) {
      if (err instanceof InvalidQueryParams) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const professionId = parseIdParam(req);
      const profession = await this.professionService.getById(professionId);

      if (!profession) {
        res.status(404).json();
        return;
      }

      res.status(200).json(profession);
    } catch (err) {
      if (err instanceof InvalidQueryParams) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };
}
