import { SpecialityTrack } from 'app/model/specialityTrack';
import { ISpecialityTrackRepository } from 'app/repository/postgres/interface';
import { ISpecialityTrackS3 } from 'app/repository/s3/interface';
import { ISpecialityTrackService } from 'app/service/interface';
import { CreateSpecialityTrackDTO } from 'app/types/specialityTrack';

export class SpecialityTrackService implements ISpecialityTrackService {
  constructor(
    private readonly specialityTrackRepo: ISpecialityTrackRepository,
    private readonly specialityTrackS3: ISpecialityTrackS3,
  ) {}

  async create(payload: CreateSpecialityTrackDTO, file: Express.Multer.File): Promise<void> {
    const filePath = await this.specialityTrackS3.save(file, payload.title);
    payload.imageLink = filePath;

    await this.specialityTrackRepo.create(payload);
  }

  async getAllBySpecialityId(id: number): Promise<SpecialityTrack[]> {
    return await this.specialityTrackRepo.getAllBySpecialityId(id);
  }
}
