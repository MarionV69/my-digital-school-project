import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Establishment } from 'src/establishments/entities/establishment.entity';
import { FilesService } from 'src/files/files.service';

describe('ConversationsService', () => {
  let service: ConversationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        { provide: getRepositoryToken(Conversation), useValue: {} },
        { provide: getRepositoryToken(Message), useValue: {} },
        { provide: getRepositoryToken(Establishment), useValue: {} },
        {
          provide: FilesService,
          useValue: { create: jest.fn(), getPrivateFileSignedUrl: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
