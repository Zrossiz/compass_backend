import { randomUUID } from 'node:crypto';
import { ISpecialityTrackS3, TrackImage } from 'app/repository/s3/interface';
import * as Minio from 'minio';

const bucketName = 'speciality-tracks';

export class SpecialityTrackS3 implements ISpecialityTrackS3 {
  constructor(private readonly s3Client: Minio.Client) {}

  async save(file: Express.Multer.File): Promise<string> {
    const bucketExists = await this.s3Client.bucketExists(bucketName);

    if (!bucketExists) {
      await this.s3Client.makeBucket(bucketName, 'eu-central-1');
    }

    const metaData = {
      'Content-Type': file.mimetype,
    };

    const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[file.mimetype];
    const imagePath = `/${randomUUID()}.${extension}`;

    await this.s3Client.putObject(bucketName, imagePath, file.buffer, file.size, metaData);

    return `${bucketName}${imagePath}`;
  }

  private objectPath(path: string): string {
    // Older uploads used an object key starting with '/'. Preserve it when reading.
    return path.startsWith(bucketName) ? path.slice(bucketName.length) : path;
  }

  async getImage(path: string): Promise<TrackImage> {
    const key = this.objectPath(path);
    const stat = await this.s3Client.statObject(bucketName, key);
    const contentType = String(stat.metaData['content-type'] ?? 'application/octet-stream');
    return { stream: await this.s3Client.getObject(bucketName, key), contentType };
  }

  async getPresignedUrl(path: string): Promise<string> {
    return this.s3Client.presignedUrl('GET', bucketName, this.objectPath(path));
  }
}
