import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoredFile } from './entities/stored-file.entity';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    @InjectRepository(StoredFile)
    private readonly filesRepository: Repository<StoredFile>,
  ) {}

  // Save file to S3 and store metadata in DB
  async create(
    file: Express.Multer.File,
    folder: 'public' | 'private',
  ): Promise<StoredFile> {
    // Upload to S3 and get the key (S3 path)
    const s3Key = await this.s3Service.uploadFile(file, folder);

    // Save metadata to database
    const storedFile = this.filesRepository.create({
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: s3Key,
    });

    return this.filesRepository.save(storedFile);
  }

  async findOne(id: number): Promise<StoredFile> {
    const file = await this.filesRepository.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  // Delete file from S3 and remove DB record
  async delete(id: number): Promise<void> {
    const file = await this.findOne(id);

    try {
      await this.s3Service.deleteFile(file.path);
    } catch (error) {
      console.error(`Error deleting S3 file ${file.path}:`, error);
    }

    await this.filesRepository.remove(file);
  }

  // Get public URL (direct S3 URL for /public/* files)
  getPublicFileUrl(s3Key: string): string {
    return this.s3Service.getPublicUrl(s3Key);
  }

  // Get private file endpoint (will be used to generate signed URL)
  getPrivateFileEndpoint(messageId: number, fileId: number): string {
    return `/messages/${messageId}/attachments/${fileId}`;
  }

  // Generate signed URL for private files
  async getPrivateFileSignedUrl(s3Key: string): Promise<string> {
    return this.s3Service.getSignedUrl(s3Key, 3600); // 1 hour expiration
  }
}
