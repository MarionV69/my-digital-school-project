import { Test, TestingModule } from '@nestjs/testing';
import { EstablishmentsService } from './establishments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Establishment } from './entities/establishment.entity';
import { User } from 'src/users/entities/user.entity';
import { DocumentsService } from 'src/documents/documents.service';

describe('EstablishmentsService', () => {
  let service: EstablishmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstablishmentsService,
        { provide: getRepositoryToken(Establishment), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        {
          provide: DocumentsService,
          useValue: {
            getAllDocumentUrls: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EstablishmentsService>(EstablishmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
