import { IProfessionInterviewService } from 'app/service/interface';
import { NextFunction, Request, Response } from 'express';
import { ProfessionInterviewDTO } from 'app/handler/dto/professionInterview';
import { InvalidBodyError } from 'app/errors/validation';
import { CreateProfessionInterviewDTO } from 'app/types/professionInterview';
import { InvalidQueryParams } from 'app/errors/validation';
import { parseIdParam } from 'app/handler/helper';

export class ProfessionInterviewHandler {
  constructor(private readonly professionInterviewService: IProfessionInterviewService) {}

  deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseIdParam(req);
      const deleted = await this.professionInterviewService.deleteById(id);

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
      const professionId = parseIdParam(req);
      const interviews = await this.professionInterviewService.getAllByProfessionId(professionId);

      res.status(200).json(interviews);
    } catch (err: unknown) {
      if (err instanceof InvalidQueryParams) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };
}
