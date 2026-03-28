import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../documents/entities/document.entity';
import { DocumentCategory } from '../documents/enums/document.enum';
import { Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { EstablishmentType } from '../establishments/enums/establishment-type.enum';
import { DocumentResponseDto } from './dto/document-response.dto';
import { GroupedDocumentsResponseDto } from './dto/grouped-documents-response.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
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
  // Categories that can only be uploaded by suppliers (not restaurants)
  private readonly SUPPLIER_ONLY_CATEGORIES: DocumentCategory[] = [
    DocumentCategory.CATALOG,
    DocumentCategory.GALLERY_PHOTO,
  ];

  // Upload a document after validating category-specific rules
  async upload(
    establishmentId: number,
    establishmentType: EstablishmentType | null,
    file: Express.Multer.File,
    category: DocumentCategory,
  ): Promise<DocumentResponseDto> {
    this.validateCategoryForEstablishmentType(category, establishmentType);
    this.validateMimeTypeForCategory(file, category);
    await this.checkCategoryLimit(establishmentId, category);

    const storedFile = await this.filesService.create(file, 'public');
    const document = this.documentsRepository.create({
      establishmentId,
      fileId: storedFile.id,
      category,
    });
    const savedDocument = await this.documentsRepository.save(document);

    return {
      id: savedDocument.id,
      category: savedDocument.category,
      file: {
        id: storedFile.id,
        originalFilename: storedFile.originalFilename,
        mimeType: storedFile.mimeType,
        size: storedFile.size,
        url: this.filesService.getPublicFileUrl(storedFile.path),
      },
    };
  }

  async findAllByEstablishment(
    establishmentId: number,
  ): Promise<GroupedDocumentsResponseDto> {
    const documents = await this.documentsRepository.find({
      where: { establishmentId },
      relations: ['file'],
      order: { createdAt: 'DESC' },
    });

    const grouped: GroupedDocumentsResponseDto = {
      LOGO: [],
      COVER_PHOTO: [],
      CATALOG: [],
      GALLERY_PHOTO: [],
    };

    for (const doc of documents) {
      grouped[doc.category].push({
        id: doc.id,
        file: {
          id: doc.file.id,
          originalFilename: doc.file.originalFilename,
          mimeType: doc.file.mimeType,
          size: doc.file.size,
          url: this.filesService.getPublicFileUrl(doc.file.path),
        },
      });
    }

    return grouped;
  }

  async findByCategory(
    establishmentId: number,
    category: DocumentCategory,
  ): Promise<DocumentResponseDto[]> {
    const documents = await this.documentsRepository.find({
      where: { establishmentId, category },
      relations: ['file'],
      order: { createdAt: 'DESC' },
    });

    return documents.map((doc) => ({
      id: doc.id,
      category: doc.category,
      file: {
        id: doc.file.id,
        originalFilename: doc.file.originalFilename,
        mimeType: doc.file.mimeType,
        size: doc.file.size,
        url: this.filesService.getPublicFileUrl(doc.file.path),
      },
    }));
  }

  async delete(documentId: number, establishmentId: number): Promise<void> {
    const document = await this.documentsRepository.findOne({
      where: { id: documentId, establishmentId },
    });

    if (!document) {
      throw new NotFoundException(`Document not found`);
    }

    await this.filesService.delete(document.fileId);
  }

  // Validate that the category is allowed for the establishment type
  private validateCategoryForEstablishmentType(
    category: DocumentCategory,
    establishmentType: EstablishmentType | null,
  ) {
    if (
      this.SUPPLIER_ONLY_CATEGORIES.includes(category) &&
      establishmentType !== EstablishmentType.SUPPLIER
    ) {
      throw new ForbiddenException(
        `Category ${category} can only be uploaded by suppliers`,
      );
    }
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
    establishmentId: number,
    category: DocumentCategory,
  ) {
    const count = await this.documentsRepository.count({
      where: { establishmentId, category },
    });
    if (count >= this.CATEGORY_LIMITS[category]) {
      throw new BadRequestException(
        `Maximum ${this.CATEGORY_LIMITS[category]} ${category} files allowed. Please delete an existing file first.`,
      );
    }
  }
}
