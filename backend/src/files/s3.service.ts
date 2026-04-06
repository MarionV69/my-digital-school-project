import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const bucket = this.configService.get<string>('AWS_BUCKET');
    const accessKey = this.configService.get<string>('AWS_ACCESS_KEY');
    const secretKey = this.configService.get<string>('AWS_SECRET_KEY');

    if (!region || !bucket || !accessKey || !secretKey) {
      throw new Error('Missing AWS configuration in environment variables');
    }

    this.region = region;
    this.bucket = bucket;
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });
  }

  // Upload to S3 and return the key (S3 path)
  async uploadFile(
    file: Express.Multer.File,
    folder: 'public' | 'private',
  ): Promise<string> {
    const uniqueName = randomUUID() + extname(file.originalname);
    const key = `${folder}/${uniqueName}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return key;
    } catch (error) {
      this.logger.error(
        `Failed to upload file to S3 (key: ${key})`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Failed to upload file. Please try again later.',
      );
    }
  }

  // Direct public URL (for /public/* only)
  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  // Signed URL (for /private/*)
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.logger.error(
        `Failed to generate signed URL (key: ${key})`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Failed to access file. Please try again later.',
      );
    }
  }

  // Delete file from S3
  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete file from S3 (key: ${key})`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Failed to delete file. Please try again later.',
      );
    }
  }
}
