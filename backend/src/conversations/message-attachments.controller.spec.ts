import { Test, TestingModule } from '@nestjs/testing';
import { MessageAttachmentsController } from './message-attachments.controller';
import { ConversationsService } from './conversations.service';

describe('MessageAttachmentsController', () => {
  let controller: MessageAttachmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageAttachmentsController],
      providers: [
        {
          provide: ConversationsService,
          useValue: {
            sendAttachment: jest.fn(),
            getAttachmentSignedUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MessageAttachmentsController>(
      MessageAttachmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
