export interface IMinio {
  readonly specialityTrack: ISpecialityTrackS3;
}

export interface ISpecialityTrackS3 {
  save(file: Express.Multer.File, specialityTitle: string): Promise<string>;
}
