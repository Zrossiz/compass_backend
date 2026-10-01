import { ISpecialityTrackS3 } from 'app/repository/s3/interface';
import * as Minio from 'minio';

const bucketName = 'speciality-tracks';

export class SpecialityTrackS3 implements ISpecialityTrackS3 {
  constructor(private readonly s3Client: Minio.Client) {}

  async save(file: Express.Multer.File, specialityTitle: string): Promise<string> {
    const bucketExists = await this.s3Client.bucketExists(bucketName);

    if (!bucketExists) {
      await this.s3Client.makeBucket(bucketName, 'eu-central-1');
    }

    const metaData = {
      'Content-Type': file.mimetype,
    };

    const imagePath = `/${specialityTitle}/${file.originalname}`;

    await this.s3Client.putObject(bucketName, imagePath, file.buffer, file.size, metaData);

    return `${bucketName}${imagePath}`;
  }

  async getPresignedUrl(path: string): Promise<string> {
    return this.s3Client.presignedUrl("GET", bucketName, path)
  }
}
