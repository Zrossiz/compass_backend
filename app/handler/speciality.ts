import { ISpecialityService } from 'app/service/interface';
import { Request, Response, NextFunction } from 'express';
import { InvalidBodyError } from 'app/errors/validation';
import { InvalidQueryParams } from 'app/errors/validation';
import { buildPagination, parseIdParam } from 'app/handler/helper';
import { SpecialityDTO, SpecialitySearchQueryDTO } from 'app/handler/dto/speciality';
import { SearchQueryDTO } from 'app/handler/dto/common';
import { CreateSpecialityDTO } from 'app/types/speciality';
import { SpecialityAlreadyExistsError } from 'app/errors/speciality';

export class SpecialityHandler {
  constructor(private readonly specialityService: ISpecialityService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = SpecialityDTO.safeParse(req.body);
      if (!parsed.success) {
        throw new InvalidBodyError();
      }
      const payload: CreateSpecialityDTO = {
        professionId: parsed.data.professionId,
        title: parsed.data.title,
        description: parsed.data.description,
      };

      await this.specialityService.create(payload);

      res.status(201).json();
    } catch (err: unknown) {
      if (err instanceof InvalidBodyError) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (err instanceof SpecialityAlreadyExistsError) {
        res.status(409).json({ error: err.message });
        return;
      }

      next(err);
    }
  };

  find = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedQuery = SearchQueryDTO.safeParse(req.query);
      const parsedSpecialityQuery = SpecialitySearchQueryDTO.safeParse(req.query);
      if (!parsedQuery.success || !parsedSpecialityQuery.success) {
        throw new InvalidQueryParams();
      }

      const pagination = buildPagination(req);

      const paginatedSpecialities = await this.specialityService.search(
        parsedQuery.data.search,
        parsedSpecialityQuery.data.professionId,
        pagination,
      );
      paginatedSpecialities.curPage = pagination.page;

      res.status(200).json(paginatedSpecialities);
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
      const specialityId = parseIdParam(req);
      const speciality = await this.specialityService.getById(specialityId);

      if (!speciality) {
        res.status(404).json();
        return;
      }

      res.status(200).json(speciality);
    } catch (err) {
      if (err instanceof InvalidQueryParams) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };
}
