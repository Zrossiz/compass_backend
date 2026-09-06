import { ISpecialityTrackService } from 'app/service/interface';
import { NextFunction, Request, Response } from 'express';
import { InvalidBodyError, InvalidQueryParams } from 'app/errors/validation';
import { SpecialityTrackDTO, SpecialityTrackFileDTO } from 'app/handler/dto/specialityTrack';
import { CreateSpecialityTrackDTO } from 'app/types/specialityTrack';
import { parseIdParam } from 'app/handler/helper';

export class SpecialityTrackHandler {
  constructor(private readonly specialityTrackService: ISpecialityTrackService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = SpecialityTrackDTO.safeParse(req.body);
      const parsedFile = SpecialityTrackFileDTO.safeParse(req.file);
      if (!parsed.success || !parsedFile.success) {
        throw new InvalidBodyError();
      }

      const file: Express.Multer.File = parsedFile.data;
      const payload: CreateSpecialityTrackDTO = {
        specialityId: parsed.data.specialityId,
        title: parsed.data.title,
        imageLink: '',
        sortOrder: parsed.data.sortOrder,
      };

      await this.specialityTrackService.create(payload, file);

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
      const tracks = await this.specialityTrackService.getAllBySpecialityId(specialityId);

      res.status(200).json(tracks);
    } catch (err: unknown) {
      if (err instanceof InvalidQueryParams) {
        res.status(400).json({ error: err.message });
        return;
      }

      next(err);
    }
  };
}
