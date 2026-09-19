import { parseIdParam } from 'app/handler/helper';
import { ISpecialityUniversityService } from 'app/service/interface';
import { NextFunction, Request, Response } from 'express';
import { InvalidBodyError, InvalidQueryParams } from 'app/errors/validation';
import { SpecialityUniversityDTO } from 'app/handler/dto/specialityUniversity';

export class SpecialityUniversityHandler {
  constructor(private readonly specialityUniversityService: ISpecialityUniversityService) {}

  deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseIdParam(req);
      const deleted = await this.specialityUniversityService.deleteById(id);

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
      const parsed = SpecialityUniversityDTO.safeParse(req.body);
      if (!parsed.success) {
        throw new InvalidBodyError();
      }

      await this.specialityUniversityService.create(parsed.data.specialityId, parsed.data.universityId);

      res.status(201).json();
    } catch (err: unknown) {
      if (err instanceof InvalidBodyError) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };
}
