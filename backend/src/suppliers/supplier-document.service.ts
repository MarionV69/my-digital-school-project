import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierDocument } from './entities/supplier-document.entity';
import { DocumentCategory } from './enums/document-category.enum';
import { Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { SuppliersService } from './suppliers.service';

@Injectable()
export class SupplierDocumentsService {
  constructor(
    @InjectRepository(SupplierDocument)
    private supplierDocumentsRepository: Repository<SupplierDocument>,
    private readonly suppliersService: SuppliersService,
    private readonly filesService: FilesService,
  ) {}

  // Number of allowed documents for each category
  private readonly CATEGORY_LIMITS: Record<DocumentCategory, number> = {
    [DocumentCategory.LOGO]: 1,
    [DocumentCategory.COVER_PHOTO]: 1,
    [DocumentCategory.CATALOG]: 1,
    [DocumentCategory.GALLERY_PHOTO]: 6,
  };

  // Allowed mime types for each category
  private readonly CATEGORY_ALLOWED_MIME_TYPES: Record<
    DocumentCategory,
    string[]
  > = {
    [DocumentCategory.LOGO]: ['image/png', 'image/jpeg', 'image/webp'],
    [DocumentCategory.COVER_PHOTO]: ['image/png', 'image/jpeg', 'image/webp'],
    [DocumentCategory.CATALOG]: ['application/pdf'],
    [DocumentCategory.GALLERY_PHOTO]: ['image/png', 'image/jpeg', 'image/webp'],
  };

  // Upload a supplier document(with category-specific rules)
  async upload(
    supplierId: number,
    userId: number,
    file: Express.Multer.File,
    category: DocumentCategory,
  ) {
    await this.suppliersService.verifyOwnership(supplierId, userId);

    this.validateMimeTypeForCategory(file, category);
    await this.checkCategoryLimit(supplierId, category);

    const storedFile = await this.filesService.create(file);

    const supplierDocument = this.supplierDocumentsRepository.create({
      supplierId,
      fileId: storedFile.id,
      category,
    });

    const savedDocument =
      await this.supplierDocumentsRepository.save(supplierDocument);

    return {
      id: savedDocument.id,
      category: savedDocument.category,
      file: {
        id: storedFile.id,
        originalFilename: storedFile.originalFilename,
        mimeType: storedFile.mimeType,
        size: storedFile.size,
        url: this.filesService.getPublicFileUrl(storedFile.storedFilename),
      },
    };
  }

  // Validate file mime type based on category
  private validateMimeTypeForCategory(
    file: Express.Multer.File,
    category: DocumentCategory,
  ) {
    const allowedTypes = this.CATEGORY_ALLOWED_MIME_TYPES[category];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type for ${category}. Allowed: ${allowedTypes.join(', ')}`,
      );
    }
  }

  // Check if category limit is reached (for categories with limit > 1)
  private async checkCategoryLimit(
    supplierId: number,
    category: DocumentCategory,
  ) {
    const count = await this.supplierDocumentsRepository.count({
      where: { supplierId, category },
    });
    if (count >= this.CATEGORY_LIMITS[category]) {
      throw new BadRequestException(
        `Maximum ${this.CATEGORY_LIMITS[category]} ${category} files allowed. Please delete an existing file first.`,
      );
    }
  }
}
