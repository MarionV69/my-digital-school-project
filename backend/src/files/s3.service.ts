import { Injectable } from '@nestjs/common';
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

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION')!;
    this.bucket = this.configService.get<string>('AWS_BUCKET')!;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY')!,
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

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }

  // Direct public URL (for /public/* only)
  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  // Signed URL (for /private/*)
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  // Delete file from S3
  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
