import { S3Config } from 'app/config/config';
import * as Minio from 'minio';
import { ISpecialityTrackS3 } from 'app/repository/s3/interface';
import { SpecialityTrackS3 } from 'app/repository/s3/specialityTrack';

export const newS3Client = (cfg: S3Config): Minio.Client => {
  const minioClient = new Minio.Client({
    endPoint: cfg.host,
    port: cfg.port,
    useSSL: cfg.useSsl,
    accessKey: cfg.accessKey,
    secretKey: cfg.secretKey,
  });

  return minioClient;
};

export class S3 {
  readonly specialityTrack: ISpecialityTrackS3;

  constructor(private readonly s3Client: Minio.Client) {
    this.specialityTrack = new SpecialityTrackS3(s3Client);
  }
}
