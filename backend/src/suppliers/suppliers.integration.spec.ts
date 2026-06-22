// src/suppliers/suppliers.integration.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { SupplierAttributes } from './entities/supplier-attributes.entity';
import { Label } from './entities/label.entity';
import { ProductCategory } from './entities/product-category.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { DocumentsService } from 'src/documents/documents.service';

type MockRepository = {
  createQueryBuilder: jest.Mock;
};

describe('GET /suppliers (integration)', () => {
  let app: INestApplication;

  // -- Arrange (construction de l'application de tests) --
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
      providers: [
        SuppliersService,
        {
          provide: getRepositoryToken(SupplierAttributes),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
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

    app = moduleFixture.createNestApplication();

    // On applique le même ValidationPipe global que dans main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('retourne 400 si un filtre inconnu est envoyé', async () => {
    // -- Act --
    const response = await request(app.getHttpServer()).get(
      '/suppliers?unknownField=test',
    );

    // -- Assert --
    expect(response.status).toBe(400);
  });

  it('retourne 200 et un tableau quand la requête est valide', async () => {
    // -- Arrange --
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    const repository = app.get<MockRepository>(
      getRepositoryToken(SupplierAttributes),
    );
    repository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);
    // -- Act --
    const response = await request(app.getHttpServer()).get(
      '/suppliers?city=Lyon',
    );
    // -- Assert --
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
