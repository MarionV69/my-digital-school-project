import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoredFile } from './entities/stored-file.entity';
import * as fs from 'fs/promises';
import { PUBLIC_STATIC_URL_PREFIX } from '../config/storage.config';
import path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(StoredFile)
    private readonly filesRepository: Repository<StoredFile>,
  ) {}

  async create(file: Express.Multer.File): Promise<StoredFile> {
    const relativePath = path.relative(process.cwd(), file.path);

    const storedFile = this.filesRepository.create({
      originalFilename: file.originalname,
      storedFilename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: relativePath,
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

  async delete(id: number): Promise<void> {
    const file = await this.findOne(id);

    // Delete physical file
    try {
      await fs.unlink(file.path);
    } catch (error) {
      console.error(`Error deleting file ${file.path}:`, error);
    }

    // Remove from database
    await this.filesRepository.remove(file);
  }

  getPublicFileUrl(storedFilename: string): string {
    const baseUrl =
      this.configService.get<string>('APP_BASE_URL') ??
      `http://localhost:${this.configService.get<number>('PORT')}`;

    return `${baseUrl}${PUBLIC_STATIC_URL_PREFIX}/${storedFilename}`;
  }

  getPrivateFileEndpoint(messageId: number, fileId: number): string {
    return `/messages/${messageId}/attachments/${fileId}`;
  }
}
