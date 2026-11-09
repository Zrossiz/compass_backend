import { SpecialityTrack } from 'app/model/specialityTrack';
import { ISpecialityTrackRepository } from 'app/repository/postgres/interface';
import { ISpecialityTrackS3, TrackImage } from 'app/repository/s3/interface';
import { ISpecialityTrackService } from 'app/service/interface';
import { CreateSpecialityTrackDTO, UpdateSpecialityTrackDTO } from 'app/types/specialityTrack';

export class SpecialityTrackService implements ISpecialityTrackService {
  constructor(
    private readonly specialityTrackRepo: ISpecialityTrackRepository,
    private readonly specialityTrackS3: ISpecialityTrackS3,
  ) {}

  async getImage(id: number): Promise<TrackImage | null> {
    const track = await this.specialityTrackRepo.getById(id);
    return track ? this.specialityTrackS3.getImage(track.imageLink) : null;
  }

  async deleteById(id: number): Promise<boolean> {
    return await this.specialityTrackRepo.deleteById(id);
  }

  async create(payload: CreateSpecialityTrackDTO, file: Express.Multer.File): Promise<void> {
    const filePath = await this.specialityTrackS3.save(file);
    payload.imageLink = filePath;

    await this.specialityTrackRepo.create(payload);
  }

  async update(id: number, payload: UpdateSpecialityTrackDTO, file?: Express.Multer.File): Promise<boolean> {
    if (!(await this.specialityTrackRepo.getById(id))) return false;
    if (file) payload.imageLink = await this.specialityTrackS3.save(file);
    await this.specialityTrackRepo.update(id, payload);
    return true;
  }

  async getAllBySpecialityId(id: number): Promise<SpecialityTrack[]> {
    const tracks = await this.specialityTrackRepo.getAllBySpecialityId(id);

    return tracks.map((track) => ({ ...track, imageLink: `/api/v1/speciality-track/${track.id}/image` }));
  }
}
