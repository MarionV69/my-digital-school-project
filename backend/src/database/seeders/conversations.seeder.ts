import { DataSource } from 'typeorm';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { Message } from '../../conversations/entities/message.entity';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { conversationsData } from '../data/conversations.data';

export async function seedConversations(dataSource: DataSource): Promise<void> {
  console.log('📌 Seeding conversations...');

  const conversationRepo = dataSource.getRepository(Conversation);
  const messageRepo = dataSource.getRepository(Message);
  const establishmentRepo = dataSource.getRepository(Establishment);

  for (const convData of conversationsData) {
    const restaurant = await establishmentRepo.findOne({
      where: { email: convData.restaurantEmail },
    });

    const supplier = await establishmentRepo.findOne({
      where: { email: convData.supplierEmail },
    });

    if (!restaurant || !supplier) {
      console.log('  ⚠️ Restaurant ou supplier introuvable');
      continue;
    }

    // Vérifie si déjà existante
    let conversation = await conversationRepo.findOne({
      where: {
        restaurantId: restaurant.id,
        supplierId: supplier.id,
      },
    });

    if (!conversation) {
      conversation = await conversationRepo.save({
        restaurantId: restaurant.id,
        supplierId: supplier.id,
      });

      console.log(
        `  ✅ Conversation créée: ${convData.restaurantEmail} ↔ ${convData.supplierEmail}`,
      );

      // Messages
      for (const msg of convData.messages) {
        await messageRepo.save({
          conversation: conversation,
          senderType: msg.senderType,
          content: msg.content,
          sentAt: msg.sentAt,
          isReadByRecipient: msg.isReadByRecipient,
        });
      }
    }
  }
}
