import { Readable } from 'node:stream';

export type TrackImage = { stream: Readable; contentType: string };

export interface IMinio {
  readonly specialityTrack: ISpecialityTrackS3;
}

export interface ISpecialityTrackS3 {
  getImage(path: string): Promise<TrackImage>;
  save(file: Express.Multer.File): Promise<string>;
  getPresignedUrl(path: string): Promise<string>;
}
