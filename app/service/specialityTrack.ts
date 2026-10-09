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

  async deleteById(id: number): Promise<boolean> {
    return await this.specialityTrackRepo.deleteById(id);
  }

  async create(payload: CreateSpecialityTrackDTO, file: Express.Multer.File): Promise<void> {
    const filePath = await this.specialityTrackS3.save(file, payload.title);
    payload.imageLink = filePath;

    await this.specialityTrackRepo.create(payload);
  }

  async update(id: number, payload: CreateSpecialityTrackDTO, file: Express.Multer.File): Promise<void> {
    payload.imageLink = await this.specialityTrackS3.save(file, payload.title);
    await this.specialityTrackRepo.update(id, payload);
  }

  async getAllBySpecialityId(id: number): Promise<SpecialityTrack[]> {
    const tracks = await this.specialityTrackRepo.getAllBySpecialityId(id);

    return tracks;
  }
}
