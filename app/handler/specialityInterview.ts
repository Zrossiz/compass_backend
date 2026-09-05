import { ISpecialityInterviewService } from 'app/service/interface';
import { NextFunction, Request, Response } from 'express';
import { SpecialityInterviewDTO } from './dto/specialityInterview';
import { InvalidBodyError } from 'app/errors/validation';
import { CreateSpecialityInterviewDTO } from 'app/types/specialityInterview';

export class SpecialityInterviewHandler {
  constructor(private readonly specialityInterviewService: ISpecialityInterviewService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = SpecialityInterviewDTO.safeParse(req.body);
      if (!parsed.success) {
        throw new InvalidBodyError();
      }

      const payload: CreateSpecialityInterviewDTO = {
        specialityId: parsed.data.specialityId,
        title: parsed.data.title,
        videoLink: parsed.data.videoLink,
        order: parsed.data.order,
      };

      await this.specialityInterviewService.create(payload);

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
      const specialityId = Number(req.params.id);
      if (!Number.isInteger(specialityId) || specialityId <= 0) {
        throw new InvalidBodyError();
      }

      const interviews = await this.specialityInterviewService.getAllBySpecialityId(specialityId);

      res.status(200).json(interviews);
    } catch (err: unknown) {
      if (err instanceof InvalidBodyError) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };
}
