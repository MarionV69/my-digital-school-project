import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoredFile } from './entities/stored-file.entity';
import * as fs from 'fs/promises';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(StoredFile)
    private readonly filesRepository: Repository<StoredFile>,
  ) {}

  async create(file: Express.Multer.File): Promise<StoredFile> {
    const storedFile = this.filesRepository.create({
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
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
}
