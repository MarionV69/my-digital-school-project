import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupplierAttributes } from './entities/supplier-attributes.entity';
import { Label } from './entities/label.entity';
import { ProductCategory } from './entities/product-category.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { DocumentsService } from 'src/documents/documents.service';

describe('SuppliersService', () => {
  let service: SuppliersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersService,
        {
          provide: getRepositoryToken(SupplierAttributes),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Label),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ProductCategory),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Favorite),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Review),
          useValue: {},
        },
        {
          provide: DocumentsService,
          useValue: {
            getAllDocumentUrls: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
