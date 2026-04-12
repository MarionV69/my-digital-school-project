import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Favorite } from './entities/favorite.entity';
import { Establishment } from 'src/establishments/entities/establishment.entity';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Establishment),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
