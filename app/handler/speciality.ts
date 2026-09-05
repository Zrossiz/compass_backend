import { ISpecialityService } from 'app/service/interface';
import { Request, Response, NextFunction } from 'express';
import { InvalidBodyError } from 'app/errors/validation';
import { InvalidQueryParams } from 'app/errors/validation';
import { buildPagination } from 'app/handler/helper';
import { SpecialityDTO } from 'app/handler/dto/speciality';
import { CreateSpecialityDTO } from 'app/types/speciality';
import { SpecialityAlreadyExistsError } from 'app/errors/speciality';

export class SpecialityHandler {
  constructor(private readonly specialityService: ISpecialityService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = SpecialityDTO.safeParse(req.body);
    if (!parsed.success) {
      throw new InvalidBodyError();
    }

    try {
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
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const professionParam = req.query.professionId;
      let professionId: number | null = null;
      if (professionParam !== undefined && professionParam != '') {
        professionId = Number(professionParam);
      }

      const searchPattern = req.query.search;
      const pagination = buildPagination(req);

      const paginatedSpecialities = await this.specialityService.search(
        String(searchPattern ?? ''),
        professionId,
        pagination,
      );

      res.status(200).json(paginatedSpecialities);
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
      const specialityId = Number(req.params.id);

      if (!Number.isInteger(specialityId) || specialityId <= 0) {
        throw new InvalidBodyError();
      }

      const speciality = await this.specialityService.getById(specialityId);

      if (!speciality) {
        res.status(404).json();
        return;
      }

      res.status(200).json(speciality);
    } catch (err) {
      if (err instanceof InvalidBodyError) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  }
}
