import { IUniversityService } from 'app/service/interface';
import { Request, Response, NextFunction } from 'express';
import { UniversityDTO } from 'app/handler/dto/university';
import { InvalidBodyError } from 'app/errors/validation';
import { InvalidQueryParams } from 'app/errors/validation';
import { CreateUniversityDTO } from 'app/types/university';

export class UniversityHandler {
  constructor(private readonly universityService: IUniversityService) {}

  async create(req: Request, res: Response, next: NextFunction) {
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
      if (err instanceof InvalidQueryParams) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  }

  async getAllBySpecialityId(req: Request, res: Response, next: NextFunction) {
    try {
      const specialityId = Number(req.params.id);
      if (!Number.isInteger(specialityId) || specialityId <= 0) {
        throw new InvalidBodyError();
      }

      const universities = await this.universityService.getAllBySpecialityId(specialityId);

      res.status(200).json(universities);
    } catch (err: unknown) {
      next(err);
    }
  }
}
