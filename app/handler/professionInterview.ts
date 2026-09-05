import { IProfessionInterviewService } from 'app/service/interface';
import { NextFunction, Request, Response } from 'express';
import { ProfessionInterviewDTO } from 'app/handler/dto/professionInterview';
import { InvalidBodyError } from 'app/errors/validation';
import { CreateProfessionInterviewDTO } from 'app/types/professionInterview';

export class ProfessionInterviewHandler {
  constructor(private readonly professionInterviewService: IProfessionInterviewService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = ProfessionInterviewDTO.safeParse(req.body);
      if (!parsed.success) {
        throw new InvalidBodyError();
      }

      const payload: CreateProfessionInterviewDTO = {
        professionId: parsed.data.professionId,
        title: parsed.data.title,
        videoLink: parsed.data.videoLink,
        order: parsed.data.order,
      };

      await this.professionInterviewService.create(payload);
      res.status(201).json();
    } catch (err: unknown) {
      if (err instanceof InvalidBodyError) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };

  getAllByProfessionId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const professionId = Number(req.params.id);
      if (!Number.isInteger(professionId) || professionId <= 0) {
        throw new InvalidBodyError();
      }

      const interviews = await this.professionInterviewService.getAllByProfessionId(professionId);

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
