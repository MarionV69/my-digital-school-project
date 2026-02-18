import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Message } from './message.entity';
import { Establishment } from '../../establishments/entities/establishment.entity';

@Entity('conversation')
@Unique('uq_conversation_restaurant_supplier', ['restaurantId', 'supplierId'])
@Index('idx_conversation_last_message', ['lastMessageAt'])
@Index(['restaurantId'])
@Index(['supplierId'])
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id', type: 'int' })
  restaurantId: number;

  @Column({ name: 'supplier_id', type: 'int' })
  supplierId: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @Column({ name: 'last_message_at', type: 'datetime', nullable: true })
  lastMessageAt: Date | null;

  // Relations
  @ManyToOne(() => Establishment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Establishment;

  @ManyToOne(() => Establishment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Establishment;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
