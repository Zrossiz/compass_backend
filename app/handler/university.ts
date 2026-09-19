import { IUniversityService } from 'app/service/interface';
import { Request, Response, NextFunction } from 'express';
import { UniversityDTO } from 'app/handler/dto/university';
import { InvalidBodyError } from 'app/errors/validation';
import { InvalidQueryParams } from 'app/errors/validation';
import { CreateUniversityDTO } from 'app/types/university';
import { parseIdParam } from 'app/handler/helper';

export class UniversityHandler {
  constructor(private readonly universityService: IUniversityService) {}

  deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseIdParam(req);
      const deleted = await this.universityService.deleteById(id);

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
      const parsed = UniversityDTO.safeParse(req.body);
      if (!parsed.success) {
        throw new InvalidBodyError();
      }

      const payload: CreateUniversityDTO = {
        title: parsed.data.title,
        region: parsed.data.region,
        description: parsed.data.description,
      };
      await this.universityService.create(payload);

      res.status(201).json();
    } catch (err: unknown) {
      if (err instanceof InvalidBodyError) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };

  getAllBySpecialityId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const specialityId = parseIdParam(req);
      const universities = await this.universityService.getAllBySpecialityId(specialityId);

      res.status(200).json(universities);
    } catch (err: unknown) {
      if (err instanceof InvalidQueryParams) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };
}
