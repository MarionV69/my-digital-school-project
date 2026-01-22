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
import { SenderType } from '../enums/sender-type.enum';
import { Conversation } from './conversation.entity';
import { StoredFile } from '../../files/entities/stored-file.entity';

@Entity('message')
@Index('idx_message_is_read', ['isRead'])
@Index('idx_message_sent_at', ['sentAt'])
@Index(['conversationId'])
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'conversation_id', type: 'int' })
  conversationId: number;

  @Column({ name: 'sender_type', type: 'enum', enum: SenderType })
  senderType: SenderType;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'sent_at', type: 'datetime' })
  sentAt: Date;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

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
