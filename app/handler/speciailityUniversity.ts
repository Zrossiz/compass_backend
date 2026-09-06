import { ISpecialityUniversityService } from 'app/service/interface';
import { NextFunction, Request, Response } from 'express';
import { InvalidBodyError } from 'app/errors/validation';
import { SpecialityUniversityDTO } from 'app/handler/dto/specialityUniversity';

export class SpecialityUniversityHandler {
  constructor(private readonly specialityUniversityService: ISpecialityUniversityService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = SpecialityUniversityDTO.safeParse(req.body);
      if (!parsed.success) {
        throw new InvalidBodyError();
      }

      await this.specialityUniversityService.create(parsed.data.specialityId, parsed.data.universityId)

      res.status(201).json();
    } catch (err: unknown) {
      if (err instanceof InvalidBodyError) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  }
}
