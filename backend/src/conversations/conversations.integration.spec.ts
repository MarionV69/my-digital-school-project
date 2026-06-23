import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { Conversation } from './entities/conversation.entity';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { UnreadCountResponseDto } from './dto/unread-count-response.dto';
import { Message } from './entities/message.entity';
import { Establishment } from 'src/establishments/entities/establishment.entity';
import { FilesService } from 'src/files/files.service';
import { DocumentsService } from 'src/documents/documents.service';
import { EstablishmentGuard } from 'src/common/guards/establishment.guard';
import { EstablishmentType } from 'src/establishments/enums/establishment-type.enum';
import {
  RESTAURANT_ID,
  SUPPLIER_ID,
  CONVERSATION_ID,
  LOGO_URL,
  SIGNED_URL,
  mockStoredFile,
  mockConversation,
  mockSupplierEstablishment,
  mockConversationWithRelations,
  mockRestaurantUser,
} from './test/conversations.fixtures';
import {
  mockConversationsRepository,
  mockMessagesRepository,
  mockEstablishmentsRepository,
  mockFilesService,
  mockDocumentsService,
} from './test/conversations.mocks';
import { MessageAttachmentResponseDto } from './dto/message-attachments-response.dto';

describe('Conversations API (integration)', () => {
  let app: INestApplication;

  // Setup
  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsController],
      providers: [
        ConversationsService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: mockConversationsRepository,
        },
        {
          provide: getRepositoryToken(Message),
          useValue: mockMessagesRepository,
        },
        {
          provide: getRepositoryToken(Establishment),
          useValue: mockEstablishmentsRepository,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    })
      .overrideGuard(EstablishmentGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context
            .switchToHttp()
            .getRequest<Record<string, unknown>>();
          req.user = mockRestaurantUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // POST /conversations
  describe('POST /conversations', () => {
    test('returns 201 and the conversation when created successfully', async () => {
      // Arrange
      mockEstablishmentsRepository.findOne.mockResolvedValue({
        id: SUPPLIER_ID,
      });
      mockConversationsRepository.findOne.mockResolvedValue(null);
      mockConversationsRepository.create.mockReturnValue(mockConversation);
      mockConversationsRepository.save.mockResolvedValue(mockConversation);

      // Act
      const response = await request(app.getHttpServer())
        .post('/conversations')
        .send({ supplierId: SUPPLIER_ID });

      // Assert
      const body = response.body as Conversation;
      expect(response.status).toBe(201);
      expect(body).toMatchObject({
        id: expect.any(Number) as number,
        restaurantId: RESTAURANT_ID,
        supplierId: SUPPLIER_ID,
      });
    });

    test('returns 404 when supplier does not exist', async () => {
      // Arrange
      const nonExistentSupplierId = 999;
      mockEstablishmentsRepository.findOne.mockResolvedValue(null);

      // Act
      const response = await request(app.getHttpServer())
        .post('/conversations')
        .send({ supplierId: nonExistentSupplierId });

      // Assert
      expect(response.status).toBe(404);
    });

    test('returns 400 when supplierId is missing', async () => {
      // Arrange
      const bodyWithoutSupplierId = {};

      // Act
      const response = await request(app.getHttpServer())
        .post('/conversations')
        .send(bodyWithoutSupplierId);

      // Assert
      expect(response.status).toBe(400);
    });

    test('returns 400 when supplierId is not a number', async () => {
      // Arrange
      const bodyWithInvalidSupplierId = { supplierId: 'invalid' };

      // Act
      const response = await request(app.getHttpServer())
        .post('/conversations')
        .send(bodyWithInvalidSupplierId);

      // Assert
      expect(response.status).toBe(400);
    });
  });

  // POST /conversations/:id/messages/:messageId/attachments
  describe('POST /conversations/:id/messages/:messageId/attachments', () => {
    test('returns 201 and the attachment response when upload is successful', async () => {
      // Arrange
      const message = {
        id: 1,
        conversationId: CONVERSATION_ID,
        conversation: mockConversation,
        files: [],
      };
      mockMessagesRepository.findOne.mockResolvedValue(message);
      mockFilesService.create.mockResolvedValue(mockStoredFile);
      mockMessagesRepository.save.mockResolvedValue(undefined);

      // Act
      const response = await request(app.getHttpServer())
        .post(`/conversations/${CONVERSATION_ID}/messages/1/attachments`)
        .attach('attachment', Buffer.from('fake file content'), 'doc.pdf');

      // Assert
      const body = response.body as MessageAttachmentResponseDto;
      expect(response.status).toBe(201);
      expect(body).toMatchObject({
        id: expect.any(Number) as number,
        originalFilename: expect.any(String) as string,
        mimeType: expect.any(String) as string,
        size: expect.any(Number) as number,
        endpoint: expect.any(String) as string,
      });
    });

    test('returns 404 when message does not exist', async () => {
      // Arrange
      mockMessagesRepository.findOne.mockResolvedValue(null);

      // Act
      const response = await request(app.getHttpServer())
        .post(`/conversations/${CONVERSATION_ID}/messages/999/attachments`)
        .attach('attachment', Buffer.from('fake file content'), 'doc.pdf');

      // Assert
      expect(response.status).toBe(404);
    });

    test('returns 403 when establishment is not a participant', async () => {
      // Arrange
      const message = {
        id: 1,
        conversationId: CONVERSATION_ID,
        conversation: {
          ...mockConversation,
          restaurantId: 999,
          supplierId: 888,
        },
        files: [],
      };
      mockMessagesRepository.findOne.mockResolvedValue(message);

      // Act
      const response = await request(app.getHttpServer())
        .post(`/conversations/${CONVERSATION_ID}/messages/1/attachments`)
        .attach('attachment', Buffer.from('fake file content'), 'doc.pdf');

      // Assert
      expect(response.status).toBe(403);
    });

    test('returns 422 when no file is attached', async () => {
      // Arrange
      const bodyWithoutAttachment = {};

      // Act
      const response = await request(app.getHttpServer())
        .post(`/conversations/${CONVERSATION_ID}/messages/1/attachments`)
        .send(bodyWithoutAttachment);

      // Assert
      expect(response.status).toBe(422);
    });
  });

  // GET /conversations
  describe('GET /conversations', () => {
    test('returns 200 and empty array when no conversations exist', async () => {
      // Arrange
      mockConversationsRepository.find.mockResolvedValue([]);

      // Act
      const response = await request(app.getHttpServer()).get('/conversations');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('returns 200 and conversations with correct structure', async () => {
      // Arrange
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest
          .fn()
          .mockResolvedValue([{ conversationId: CONVERSATION_ID, count: '2' }]),
      };
      mockConversationsRepository.find.mockResolvedValue([
        mockConversationWithRelations,
      ]);
      mockMessagesRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockDocumentsService.getAllDocumentUrls.mockReturnValue({
        logoUrl: LOGO_URL,
        coverPhotoUrl: null,
        catalogs: [],
        galleryPhotos: [],
      });

      // Act
      const response = await request(app.getHttpServer()).get('/conversations');

      // Assert
      const body = response.body as ConversationResponseDto[];
      expect(response.status).toBe(200);
      expect(body).toHaveLength(1);
      expect(body[0]).toMatchObject({
        id: expect.any(Number) as number,
        unreadCount: 2,
        lastMessageAt: null,
        otherParticipant: {
          id: SUPPLIER_ID,
          name: mockSupplierEstablishment.tradeName,
          avatarUrl: LOGO_URL,
        },
      });
      expect(body[0].otherParticipant).not.toHaveProperty('siret');
      expect(body[0].otherParticipant).not.toHaveProperty('vatNumber');
    });
  });

  // GET /conversations/unread-count
  describe('GET /conversations/unread-count', () => {
    test('returns 200 and the unread count', async () => {
      // Arrange
      const mockQueryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(3),
      };
      mockMessagesRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      // Act
      const response = await request(app.getHttpServer()).get(
        '/conversations/unread-count',
      );

      // Assert
      const body = response.body as UnreadCountResponseDto;
      expect(response.status).toBe(200);
      expect(body).toMatchObject({
        count: expect.any(Number) as number,
      });
      expect(body.count).toBe(3);
    });
  });

  // POST /conversations/:id/messages
  describe('POST /conversations/:id/messages', () => {
    test('returns 201 and the message with correct structure', async () => {
      // Arrange
      const createdMessage = {
        id: 10,
        conversationId: CONVERSATION_ID,
        senderType: EstablishmentType.RESTAURANT,
        content: 'Hello',
        sentAt: new Date().toISOString(),
        isReadByRecipient: false,
        attachments: [],
      };
      mockConversationsRepository.findOne.mockResolvedValue(mockConversation);
      mockMessagesRepository.create.mockReturnValue(createdMessage);
      mockMessagesRepository.save.mockResolvedValue(createdMessage);
      mockConversationsRepository.update.mockResolvedValue(undefined);

      // Act
      const response = await request(app.getHttpServer())
        .post(`/conversations/${CONVERSATION_ID}/messages`)
        .send({ content: 'Hello' });

      // Assert
      const body = response.body as MessageResponseDto;
      expect(response.status).toBe(201);
      expect(body).toMatchObject({
        id: expect.any(Number) as number,
        conversationId: CONVERSATION_ID,
        senderType: EstablishmentType.RESTAURANT,
        content: 'Hello',
        isReadByRecipient: false,
        attachments: [],
      });
    });

    test('returns 400 when content and attachment are both missing', async () => {
      // Arrange
      const bodyWithoutContentOrAttachment = {};

      // Act
      const response = await request(app.getHttpServer())
        .post(`/conversations/${CONVERSATION_ID}/messages`)
        .send(bodyWithoutContentOrAttachment);

      // Assert
      expect(response.status).toBe(400);
    });

    test('returns 404 when conversation does not exist', async () => {
      // Arrange
      mockConversationsRepository.findOne.mockResolvedValue(null);

      // Act
      const response = await request(app.getHttpServer())
        .post(`/conversations/${CONVERSATION_ID}/messages`)
        .send({ content: 'Hello' });

      // Assert
      expect(response.status).toBe(404);
    });

    test('returns 403 when establishment is not a participant', async () => {
      // Arrange
      mockConversationsRepository.findOne.mockResolvedValue({
        ...mockConversation,
        restaurantId: 999,
        supplierId: 888,
      });

      // Act
      const response = await request(app.getHttpServer())
        .post(`/conversations/${CONVERSATION_ID}/messages`)
        .send({ content: 'Hello' });

      // Assert
      expect(response.status).toBe(403);
    });
  });

  // GET /conversations/:id/messages
  describe('GET /conversations/:id/messages', () => {
    test('returns 200 and messages with correct structure', async () => {
      // Arrange
      const messages = [
        {
          id: 1,
          conversationId: CONVERSATION_ID,
          senderType: EstablishmentType.SUPPLIER,
          content: 'Hello',
          sentAt: new Date(),
          isReadByRecipient: false,
          files: [],
        },
      ];
      mockConversationsRepository.findOne.mockResolvedValue(mockConversation);
      mockMessagesRepository.update.mockResolvedValue(undefined);
      mockMessagesRepository.find.mockResolvedValue(messages);

      // Act
      const response = await request(app.getHttpServer()).get(
        `/conversations/${CONVERSATION_ID}/messages`,
      );

      // Assert
      const body = response.body as MessageResponseDto[];
      expect(response.status).toBe(200);
      expect(body).toHaveLength(1);
      expect(body[0]).toMatchObject({
        id: expect.any(Number) as number,
        conversationId: CONVERSATION_ID,
        senderType: EstablishmentType.SUPPLIER,
        content: 'Hello',
        isReadByRecipient: expect.any(Boolean) as boolean,
        attachments: [],
      });
    });

    test('returns 404 when conversation does not exist', async () => {
      // Arrange
      mockConversationsRepository.findOne.mockResolvedValue(null);

      // Act
      const response = await request(app.getHttpServer()).get(
        `/conversations/${CONVERSATION_ID}/messages`,
      );

      // Assert
      expect(response.status).toBe(404);
    });

    test('returns 403 when establishment is not a participant', async () => {
      // Arrange
      mockConversationsRepository.findOne.mockResolvedValue({
        ...mockConversation,
        restaurantId: 999,
        supplierId: 888,
      });

      // Act
      const response = await request(app.getHttpServer()).get(
        `/conversations/${CONVERSATION_ID}/messages`,
      );

      // Assert
      expect(response.status).toBe(403);
    });
  });

  // GET /conversations/:id/messages/:messageId/attachments/:attachmentId
  describe('GET /conversations/:id/messages/:messageId/attachments/:attachmentId', () => {
    test('returns 200 and signed URL with correct structure', async () => {
      // Arrange
      const message = {
        id: 1,
        conversationId: CONVERSATION_ID,
        conversation: mockConversation,
        files: [mockStoredFile],
      };
      mockMessagesRepository.findOne.mockResolvedValue(message);
      mockFilesService.getPrivateFileSignedUrl.mockResolvedValue(SIGNED_URL);

      // Act
      const response = await request(app.getHttpServer()).get(
        `/conversations/${CONVERSATION_ID}/messages/1/attachments/${mockStoredFile.id}`,
      );

      // Assert
      const body = response.body as { url: string };
      expect(response.status).toBe(200);
      expect(body).toMatchObject({
        url: expect.any(String) as string,
      });
      expect(body.url).toBe(SIGNED_URL);
    });

    test('returns 404 when message does not exist', async () => {
      // Arrange
      mockMessagesRepository.findOne.mockResolvedValue(null);

      // Act
      const response = await request(app.getHttpServer()).get(
        `/conversations/${CONVERSATION_ID}/messages/999/attachments/1`,
      );

      // Assert
      expect(response.status).toBe(404);
    });

    test('returns 403 when establishment is not a participant', async () => {
      // Arrange
      const message = {
        id: 1,
        conversationId: CONVERSATION_ID,
        conversation: {
          ...mockConversation,
          restaurantId: 999,
          supplierId: 888,
        },
        files: [mockStoredFile],
      };
      mockMessagesRepository.findOne.mockResolvedValue(message);

      // Act
      const response = await request(app.getHttpServer()).get(
        `/conversations/${CONVERSATION_ID}/messages/1/attachments/${mockStoredFile.id}`,
      );

      // Assert
      expect(response.status).toBe(403);
    });
  });
});
