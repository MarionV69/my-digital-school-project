import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { StoredFile } from '../../files/entities/stored-file.entity';
import { EstablishmentType } from 'src/establishments/enums/establishment-type.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('message')
@Index('idx_message_is_read_by_recipient', ['isReadByRecipient'])
@Index('idx_message_sent_at', ['sentAt'])
@Index(['conversationId'])
export class Message {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 2 })
  @Column({ name: 'conversation_id', type: 'int' })
  conversationId: number;

  @ApiProperty({
    enum: EstablishmentType,
    example: EstablishmentType.RESTAURANT,
  })
  @Column({ name: 'sender_type', type: 'enum', enum: EstablishmentType })
  senderType: EstablishmentType;

  @ApiProperty({ example: 'Quels sont vos délais de livraison ?' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ example: '2026-02-26T20:15:25.000Z' })
  @CreateDateColumn({ name: 'sent_at', type: 'datetime' })
  sentAt: Date;

  @ApiProperty({ example: false })
  @Column({ name: 'is_read_by_recipient', type: 'boolean', default: false })
  isReadByRecipient: boolean;

  // Relations
  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToMany(() => StoredFile, (file) => file.messages)
  @JoinTable({
    name: 'message_attachment',
    joinColumn: { name: 'message_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'file_id', referencedColumnName: 'id' },
  })
  files: StoredFile[];
}
