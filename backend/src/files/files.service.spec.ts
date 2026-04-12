import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { S3Service } from './s3.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoredFile } from './entities/stored-file.entity';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
            getPublicUrl: jest.fn(),
            getSignedUrl: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(StoredFile),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
