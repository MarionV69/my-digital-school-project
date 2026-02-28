import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Establishment } from '../establishments/entities/establishment.entity';
import { EstablishmentType } from 'src/establishments/enums/establishment-type.enum';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { UnreadCountResponseDto } from './dto/unread-count-response.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(Establishment)
    private establishmentsRepository: Repository<Establishment>,
  ) {}

  async createConversation(
    establishmentId: number,
    establishmentType: EstablishmentType,
    supplierId: number,
  ): Promise<Conversation> {
    if (establishmentType !== EstablishmentType.RESTAURANT) {
      throw new ForbiddenException('Only restaurants can create conversations');
    }

    const supplier = await this.establishmentsRepository.findOne({
      where: { id: supplierId, type: EstablishmentType.SUPPLIER },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const existing = await this.conversationsRepository.findOne({
      where: { restaurantId: establishmentId, supplierId },
    });

    if (existing) return existing;

    const conversation = this.conversationsRepository.create({
      restaurantId: establishmentId,
      supplierId,
    });

    return this.conversationsRepository.save(conversation);
  }

  async sendMessage(
    conversationId: number,
    establishmentId: number,
    establishmentType: EstablishmentType,
    content: string,
  ): Promise<Message> {
    const conversation = await this.conversationsRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    const isParticipant =
      (establishmentType === EstablishmentType.RESTAURANT &&
        conversation.restaurantId === establishmentId) ||
      (establishmentType === EstablishmentType.SUPPLIER &&
        conversation.supplierId === establishmentId);

    if (!isParticipant)
      throw new ForbiddenException(
        'You are not a participant of this conversation',
      );

    const message = this.messagesRepository.create({
      conversationId,
      content,
      senderType: establishmentType,
      isReadByRecipient: false,
    });

    await this.messagesRepository.save(message);

    await this.conversationsRepository.update(conversationId, {
      lastMessageAt: new Date(),
    });

    return message;
  }

  async getConversations(
    establishmentId: number,
    establishmentType: EstablishmentType,
  ): Promise<ConversationResponseDto[]> {
    const otherParticipantType =
      establishmentType === EstablishmentType.RESTAURANT
        ? EstablishmentType.SUPPLIER
        : EstablishmentType.RESTAURANT;

    const conversations = await this.conversationsRepository.find({
      where:
        establishmentType === EstablishmentType.RESTAURANT
          ? { restaurantId: establishmentId }
          : { supplierId: establishmentId },
      relations: [otherParticipantType.toLowerCase()],
      order: { lastMessageAt: 'DESC' },
    });

    if (conversations.length === 0) return [];

    const conversationIds = conversations.map((c) => c.id);

    const unreadCounts: { conversationId: number; count: string }[] =
      await this.messagesRepository
        .createQueryBuilder('message')
        .select('message.conversationId', 'conversationId')
        .addSelect('COUNT(*)', 'count')
        .where('message.conversationId IN (:...ids)', { ids: conversationIds })
        .andWhere('message.isReadByRecipient = false')
        .andWhere('message.senderType = :type', { type: otherParticipantType })
        .groupBy('message.conversationId')
        .getRawMany();

    const unreadCountMap: Record<number, number> = {};
    for (const row of unreadCounts) {
      unreadCountMap[row.conversationId] = parseInt(row.count);
    }

    return conversations.map((conversation) => {
      const otherParticipant =
        otherParticipantType === EstablishmentType.RESTAURANT
          ? conversation.restaurant
          : conversation.supplier;

      return {
        id: conversation.id,
        lastMessageAt: conversation.lastMessageAt as Date,
        unreadCount: unreadCountMap[conversation.id] ?? 0,
        otherParticipant: {
          id: otherParticipant.id,
          name: otherParticipant.tradeName ?? otherParticipant.legalName,
        },
      };
    });
  }

  async getConversationMessages(
    conversationId: number,
    establishmentId: number,
    establishmentType: EstablishmentType,
  ): Promise<Message[]> {
    const conversation = await this.conversationsRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    const isParticipant =
      (establishmentType === EstablishmentType.RESTAURANT &&
        conversation.restaurantId === establishmentId) ||
      (establishmentType === EstablishmentType.SUPPLIER &&
        conversation.supplierId === establishmentId);

    if (!isParticipant)
      throw new ForbiddenException(
        'You are not a participant of this conversation',
      );

    await this.messagesRepository.update(
      {
        conversationId,
        isReadByRecipient: false,
        senderType:
          establishmentType === EstablishmentType.RESTAURANT
            ? EstablishmentType.SUPPLIER
            : EstablishmentType.RESTAURANT,
      },
      { isReadByRecipient: true },
    );

    return this.messagesRepository.find({
      where: { conversationId },
      order: { sentAt: 'ASC' },
    });
  }

  async getTotalUnreadCount(
    establishmentId: number,
    establishmentType: EstablishmentType,
  ): Promise<UnreadCountResponseDto> {
    const isRestaurant = establishmentType === EstablishmentType.RESTAURANT;
    const queryBuilder = this.messagesRepository
      .createQueryBuilder('message')
      .innerJoin('message.conversation', 'conversation')
      .where('message.isReadByRecipient = false')
      .andWhere(
        isRestaurant
          ? 'conversation.restaurantId = :id'
          : 'conversation.supplierId = :id',
        { id: establishmentId },
      )
      .andWhere('message.senderType != :type', { type: establishmentType });

    const count = await queryBuilder.getCount();
    return { count };
  }
}
