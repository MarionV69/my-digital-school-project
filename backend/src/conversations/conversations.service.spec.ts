import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Establishment } from 'src/establishments/entities/establishment.entity';
import { FilesService } from 'src/files/files.service';
import { DocumentsService } from 'src/documents/documents.service';
import { EstablishmentType } from 'src/establishments/enums/establishment-type.enum';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  RESTAURANT_ID,
  SUPPLIER_ID,
  CONVERSATION_ID,
  MESSAGE_CONTENT,
  LOGO_URL,
  SIGNED_URL,
  mockStoredFile,
  mockConversation,
  mockSupplierEstablishment,
  mockConversationWithRelations,
} from './test/conversations.fixtures';
import {
  mockConversationsRepository,
  mockMessagesRepository,
  mockEstablishmentsRepository,
  mockFilesService,
  mockDocumentsService,
} from './test/conversations.mocks';

describe('ConversationsService', () => {
  let service: ConversationsService;

  // Setup
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  // createConversation
  describe('createConversation', () => {
    test('should throw ForbiddenException when called by a SUPPLIER', async () => {
      // Arrange
      const establishmentType = EstablishmentType.SUPPLIER;

      // Act
      const act = () =>
        service.createConversation(
          SUPPLIER_ID,
          establishmentType,
          RESTAURANT_ID,
        );

      // Assert
      await expect(act()).rejects.toThrow(ForbiddenException);
    });

    test('should throw NotFoundException when supplier does not exist', async () => {
      // Arrange
      const unknownSupplierId = 999;
      mockEstablishmentsRepository.findOne.mockResolvedValue(null);

      // Act
      const act = () =>
        service.createConversation(
          RESTAURANT_ID,
          EstablishmentType.RESTAURANT,
          unknownSupplierId,
        );

      // Assert
      await expect(act()).rejects.toThrow(NotFoundException);
    });

    test('should return existing conversation without calling save', async () => {
      // Arrange
      mockEstablishmentsRepository.findOne.mockResolvedValue({
        id: SUPPLIER_ID,
      });
      mockConversationsRepository.findOne.mockResolvedValue(mockConversation);

      // Act
      const result = await service.createConversation(
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
        SUPPLIER_ID,
      );

      // Assert
      expect(result).toEqual(mockConversation);
      expect(mockConversationsRepository.save).not.toHaveBeenCalled();
    });

    test('should create and return a new conversation when none exists', async () => {
      // Arrange
      mockEstablishmentsRepository.findOne.mockResolvedValue({
        id: SUPPLIER_ID,
      });
      mockConversationsRepository.findOne.mockResolvedValue(null);
      mockConversationsRepository.create.mockReturnValue(mockConversation);
      mockConversationsRepository.save.mockResolvedValue(mockConversation);

      // Act
      const result = await service.createConversation(
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
        SUPPLIER_ID,
      );

      // Assert
      expect(mockConversationsRepository.create).toHaveBeenCalledWith({
        restaurantId: RESTAURANT_ID,
        supplierId: SUPPLIER_ID,
      });
      expect(mockConversationsRepository.save).toHaveBeenCalledWith(
        mockConversation,
      );
      expect(result).toEqual(mockConversation);
    });
  });

  // sendMessage
  describe('sendMessage', () => {
    test('should throw NotFoundException when conversation does not exist', async () => {
      // Arrange
      const unknownConversationId = 999;
      mockConversationsRepository.findOne.mockResolvedValue(null);

      // Act
      const act = () =>
        service.sendMessage(
          unknownConversationId,
          RESTAURANT_ID,
          EstablishmentType.RESTAURANT,
          MESSAGE_CONTENT,
          null,
        );

      // Assert
      await expect(act()).rejects.toThrow(NotFoundException);
    });

    test('should throw ForbiddenException when establishment is not a participant', async () => {
      // Arrange
      const outsiderEstablishmentId = 99;
      mockConversationsRepository.findOne.mockResolvedValue(mockConversation);

      // Act
      const act = () =>
        service.sendMessage(
          CONVERSATION_ID,
          outsiderEstablishmentId,
          EstablishmentType.RESTAURANT,
          MESSAGE_CONTENT,
          null,
        );

      // Assert
      await expect(act()).rejects.toThrow(ForbiddenException);
    });

    test('should create a message without attachment', async () => {
      // Arrange
      const createdMessage = {
        id: 10,
        conversationId: CONVERSATION_ID,
        senderType: EstablishmentType.RESTAURANT,
        content: MESSAGE_CONTENT,
        sentAt: new Date(),
        isReadByRecipient: false,
        files: [],
      };
      mockConversationsRepository.findOne.mockResolvedValue(mockConversation);
      mockMessagesRepository.create.mockReturnValue(createdMessage);
      mockMessagesRepository.save.mockResolvedValue(createdMessage);
      mockConversationsRepository.update.mockResolvedValue(undefined);

      // Act
      const result = await service.sendMessage(
        CONVERSATION_ID,
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
        MESSAGE_CONTENT,
        null,
      );

      // Assert
      expect(mockFilesService.create).not.toHaveBeenCalled();
      expect(mockMessagesRepository.create).toHaveBeenCalledWith({
        conversationId: CONVERSATION_ID,
        content: MESSAGE_CONTENT,
        senderType: EstablishmentType.RESTAURANT,
        isReadByRecipient: false,
        files: [],
      });
      expect(mockConversationsRepository.update).toHaveBeenCalledWith(
        CONVERSATION_ID,
        expect.objectContaining({ lastMessageAt: expect.any(Date) as Date }),
      );
      expect(result.attachments).toHaveLength(0);
    });

    test('should upload attachment and include it in the response', async () => {
      // Arrange
      const mockFile = {
        originalname: 'doc.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const createdMessage = {
        id: 10,
        conversationId: CONVERSATION_ID,
        senderType: EstablishmentType.RESTAURANT,
        content: '',
        sentAt: new Date(),
        isReadByRecipient: false,
        files: [mockStoredFile],
      };
      mockConversationsRepository.findOne.mockResolvedValue(mockConversation);
      mockFilesService.create.mockResolvedValue(mockStoredFile);
      mockMessagesRepository.create.mockReturnValue(createdMessage);
      mockMessagesRepository.save.mockResolvedValue(createdMessage);
      mockConversationsRepository.update.mockResolvedValue(undefined);

      // Act
      const result = await service.sendMessage(
        CONVERSATION_ID,
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
        '',
        mockFile,
      );

      // Assert
      expect(mockFilesService.create).toHaveBeenCalledWith(mockFile, 'private');
      expect(mockConversationsRepository.update).toHaveBeenCalledWith(
        CONVERSATION_ID,
        expect.objectContaining({ lastMessageAt: expect.any(Date) as Date }),
      );
      expect(result.attachments).toHaveLength(1);
      expect(result.attachments[0].originalFilename).toBe(
        mockStoredFile.originalFilename,
      );
    });
  });

  // sendAttachment
  describe('sendAttachment', () => {
    test('should throw NotFoundException when message does not exist', async () => {
      // Arrange
      const mockFile = {
        originalname: 'doc.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      mockMessagesRepository.findOne.mockResolvedValue(null);

      // Act
      const act = () =>
        service.sendAttachment(
          CONVERSATION_ID,
          1,
          RESTAURANT_ID,
          EstablishmentType.RESTAURANT,
          mockFile,
        );

      // Assert
      await expect(act()).rejects.toThrow(NotFoundException);
    });

    test('should throw ForbiddenException when message does not belong to conversation', async () => {
      // Arrange
      const mockFile = {
        originalname: 'doc.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const messageFromOtherConversation = {
        id: 1,
        conversationId: 999,
        conversation: { ...mockConversation, id: 999 },
        files: [],
      };
      mockMessagesRepository.findOne.mockResolvedValue(
        messageFromOtherConversation,
      );

      // Act
      const act = () =>
        service.sendAttachment(
          CONVERSATION_ID,
          1,
          RESTAURANT_ID,
          EstablishmentType.RESTAURANT,
          mockFile,
        );

      // Assert
      await expect(act()).rejects.toThrow(ForbiddenException);
    });

    test('should throw ForbiddenException when establishment is not a participant', async () => {
      // Arrange
      const outsiderEstablishmentId = 99;
      const mockFile = {
        originalname: 'doc.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const message = {
        id: 1,
        conversationId: CONVERSATION_ID,
        conversation: mockConversation,
        files: [],
      };
      mockMessagesRepository.findOne.mockResolvedValue(message);

      // Act
      const act = () =>
        service.sendAttachment(
          CONVERSATION_ID,
          1,
          outsiderEstablishmentId,
          EstablishmentType.RESTAURANT,
          mockFile,
        );

      // Assert
      await expect(act()).rejects.toThrow(ForbiddenException);
    });

    test('should upload attachment and return attachment response', async () => {
      // Arrange
      const mockFile = {
        originalname: 'doc.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from(''),
      } as Express.Multer.File;
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
      const result = await service.sendAttachment(
        CONVERSATION_ID,
        1,
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
        mockFile,
      );

      // Assert
      expect(mockFilesService.create).toHaveBeenCalledWith(mockFile, 'private');
      expect(mockMessagesRepository.save).toHaveBeenCalled();
      expect(result.originalFilename).toBe(mockStoredFile.originalFilename);
      expect(result.endpoint).toBe(
        `/conversations/${CONVERSATION_ID}/messages/1/attachments/${mockStoredFile.id}`,
      );
    });
  });

  // getConversationMessages
  describe('getConversationMessages', () => {
    test('should throw NotFoundException when conversation does not exist', async () => {
      // Arrange
      const unknownConversationId = 999;
      mockConversationsRepository.findOne.mockResolvedValue(null);

      // Act
      const act = () =>
        service.getConversationMessages(
          unknownConversationId,
          RESTAURANT_ID,
          EstablishmentType.RESTAURANT,
        );

      // Assert
      await expect(act()).rejects.toThrow(NotFoundException);
    });

    test('should throw ForbiddenException when establishment is not a participant', async () => {
      // Arrange
      const outsiderEstablishmentId = 99;
      mockConversationsRepository.findOne.mockResolvedValue(mockConversation);

      // Act
      const act = () =>
        service.getConversationMessages(
          CONVERSATION_ID,
          outsiderEstablishmentId,
          EstablishmentType.RESTAURANT,
        );

      // Assert
      await expect(act()).rejects.toThrow(ForbiddenException);
    });

    test('should mark unread messages from other participant as read', async () => {
      // Arrange
      const messages = [
        {
          id: 1,
          conversationId: CONVERSATION_ID,
          senderType: EstablishmentType.SUPPLIER,
          content: MESSAGE_CONTENT,
          sentAt: new Date(),
          isReadByRecipient: false,
          files: [],
        },
      ];
      mockConversationsRepository.findOne.mockResolvedValue(mockConversation);
      mockMessagesRepository.update.mockResolvedValue(undefined);
      mockMessagesRepository.find.mockResolvedValue(messages);

      // Act
      await service.getConversationMessages(
        CONVERSATION_ID,
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
      );

      // Assert
      expect(mockMessagesRepository.update).toHaveBeenCalledWith(
        {
          conversationId: CONVERSATION_ID,
          isReadByRecipient: false,
          senderType: EstablishmentType.SUPPLIER,
        },
        { isReadByRecipient: true },
      );
    });

    test('should return messages with attachments', async () => {
      // Arrange
      const messages = [
        {
          id: 1,
          conversationId: CONVERSATION_ID,
          senderType: EstablishmentType.SUPPLIER,
          content: MESSAGE_CONTENT,
          sentAt: new Date(),
          isReadByRecipient: true,
          files: [mockStoredFile],
        },
      ];
      mockConversationsRepository.findOne.mockResolvedValue(mockConversation);
      mockMessagesRepository.update.mockResolvedValue(undefined);
      mockMessagesRepository.find.mockResolvedValue(messages);

      // Act
      const result = await service.getConversationMessages(
        CONVERSATION_ID,
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].attachments).toHaveLength(1);
      expect(result[0].attachments[0].originalFilename).toBe(
        mockStoredFile.originalFilename,
      );
    });

    test('should return empty array when conversation has no messages', async () => {
      // Arrange
      mockConversationsRepository.findOne.mockResolvedValue(mockConversation);
      mockMessagesRepository.update.mockResolvedValue(undefined);
      mockMessagesRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getConversationMessages(
        CONVERSATION_ID,
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
      );

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  // getTotalUnreadCount
  describe('getTotalUnreadCount', () => {
    test('should return the total unread count for a restaurant', async () => {
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
      const result = await service.getTotalUnreadCount(
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
      );

      // Assert
      expect(result).toEqual({ count: 3 });
    });

    test('should return zero when there are no unread messages', async () => {
      // Arrange
      const mockQueryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      };
      mockMessagesRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      // Act
      const result = await service.getTotalUnreadCount(
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
      );

      // Assert
      expect(result).toEqual({ count: 0 });
    });

    test('should return the total unread count for a supplier', async () => {
      // Arrange
      const mockQueryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(5),
      };
      mockMessagesRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      // Act
      const result = await service.getTotalUnreadCount(
        SUPPLIER_ID,
        EstablishmentType.SUPPLIER,
      );

      // Assert
      expect(result).toEqual({ count: 5 });
    });
  });

  // getConversations
  describe('getConversations', () => {
    test('should return empty array when no conversations exist', async () => {
      // Arrange
      mockConversationsRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getConversations(
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
      );

      // Assert
      expect(result).toEqual([]);
    });

    test('should return conversations with otherParticipant and unreadCount for a restaurant', async () => {
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
      const result = await service.getConversations(
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(CONVERSATION_ID);
      expect(result[0].unreadCount).toBe(2);
      expect(result[0].otherParticipant.id).toBe(SUPPLIER_ID);
      expect(result[0].otherParticipant.name).toBe(
        mockSupplierEstablishment.tradeName,
      );
      expect(result[0].otherParticipant.avatarUrl).toBe(LOGO_URL);
    });

    test('should return unreadCount of 0 when no unread messages', async () => {
      // Arrange
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      mockConversationsRepository.find.mockResolvedValue([
        mockConversationWithRelations,
      ]);
      mockMessagesRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockDocumentsService.getAllDocumentUrls.mockReturnValue({
        logoUrl: null,
        coverPhotoUrl: null,
        catalogs: [],
        galleryPhotos: [],
      });

      // Act
      const result = await service.getConversations(
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
      );

      // Assert
      expect(result[0].unreadCount).toBe(0);
      expect(result[0].otherParticipant.avatarUrl).toBeNull();
    });

    test('should not expose internal establishment fields in otherParticipant', async () => {
      // Arrange
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      mockConversationsRepository.find.mockResolvedValue([
        mockConversationWithRelations,
      ]);
      mockMessagesRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockDocumentsService.getAllDocumentUrls.mockReturnValue({
        logoUrl: null,
        coverPhotoUrl: null,
        catalogs: [],
        galleryPhotos: [],
      });

      // Act
      const result = await service.getConversations(
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
      );

      // Assert
      expect(result[0].otherParticipant).not.toHaveProperty('siret');
      expect(result[0].otherParticipant).not.toHaveProperty('vatNumber');
    });

    test('should return conversations for a supplier with restaurant as otherParticipant', async () => {
      // Arrange
      const mockRestaurantEstablishment: Partial<Establishment> = {
        id: RESTAURANT_ID,
        tradeName: 'Le Gourmet',
        legalName: 'Le Gourmet SARL',
        documents: [],
      };
      const mockConversationWithRestaurant: Partial<Conversation> = {
        ...mockConversation,
        restaurant: mockRestaurantEstablishment as Establishment,
        lastMessageAt: null,
      };
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      mockConversationsRepository.find.mockResolvedValue([
        mockConversationWithRestaurant,
      ]);
      mockMessagesRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockDocumentsService.getAllDocumentUrls.mockReturnValue({
        logoUrl: null,
        coverPhotoUrl: null,
        catalogs: [],
        galleryPhotos: [],
      });

      // Act
      const result = await service.getConversations(
        SUPPLIER_ID,
        EstablishmentType.SUPPLIER,
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].otherParticipant.id).toBe(RESTAURANT_ID);
      expect(result[0].otherParticipant.name).toBe(
        mockRestaurantEstablishment.tradeName,
      );
      expect(result[0].unreadCount).toBe(0);
    });
  });

  // getAttachmentSignedUrl
  describe('getAttachmentSignedUrl', () => {
    test('should throw NotFoundException when message does not exist', async () => {
      // Arrange
      mockMessagesRepository.findOne.mockResolvedValue(null);

      // Act
      const act = () =>
        service.getAttachmentSignedUrl(
          CONVERSATION_ID,
          1,
          mockStoredFile.id,
          RESTAURANT_ID,
          EstablishmentType.RESTAURANT,
        );

      // Assert
      await expect(act()).rejects.toThrow(NotFoundException);
    });

    test('should throw ForbiddenException when message does not belong to conversation', async () => {
      // Arrange
      const messageFromOtherConversation = {
        id: 1,
        conversationId: 999,
        conversation: { ...mockConversation, id: 999 },
        files: [],
      };
      mockMessagesRepository.findOne.mockResolvedValue(
        messageFromOtherConversation,
      );

      // Act
      const act = () =>
        service.getAttachmentSignedUrl(
          CONVERSATION_ID,
          1,
          mockStoredFile.id,
          RESTAURANT_ID,
          EstablishmentType.RESTAURANT,
        );

      // Assert
      await expect(act()).rejects.toThrow(ForbiddenException);
    });

    test('should throw ForbiddenException when establishment is not a participant', async () => {
      // Arrange
      const outsiderEstablishmentId = 99;
      const message = {
        id: 1,
        conversationId: CONVERSATION_ID,
        conversation: mockConversation,
        files: [],
      };
      mockMessagesRepository.findOne.mockResolvedValue(message);

      // Act
      const act = () =>
        service.getAttachmentSignedUrl(
          CONVERSATION_ID,
          1,
          mockStoredFile.id,
          outsiderEstablishmentId,
          EstablishmentType.RESTAURANT,
        );

      // Assert
      await expect(act()).rejects.toThrow(ForbiddenException);
    });

    test('should throw NotFoundException when attachment is not found in message', async () => {
      // Arrange
      const unknownAttachmentId = 999;
      const message = {
        id: 1,
        conversationId: CONVERSATION_ID,
        conversation: mockConversation,
        files: [mockStoredFile],
      };
      mockMessagesRepository.findOne.mockResolvedValue(message);

      // Act
      const act = () =>
        service.getAttachmentSignedUrl(
          CONVERSATION_ID,
          1,
          unknownAttachmentId,
          RESTAURANT_ID,
          EstablishmentType.RESTAURANT,
        );

      // Assert
      await expect(act()).rejects.toThrow(NotFoundException);
    });

    test('should return signed URL for a valid attachment', async () => {
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
      const result = await service.getAttachmentSignedUrl(
        CONVERSATION_ID,
        1,
        mockStoredFile.id,
        RESTAURANT_ID,
        EstablishmentType.RESTAURANT,
      );

      // Assert
      expect(mockFilesService.getPrivateFileSignedUrl).toHaveBeenCalledWith(
        mockStoredFile.path,
      );
      expect(result).toEqual({ url: SIGNED_URL });
    });
  });
});
