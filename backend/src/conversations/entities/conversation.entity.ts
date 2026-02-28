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
import { ApiProperty } from '@nestjs/swagger';

@Entity('conversation')
@Unique('uq_conversation_restaurant_supplier', ['restaurantId', 'supplierId'])
@Index('idx_conversation_last_message', ['lastMessageAt'])
@Index(['restaurantId'])
@Index(['supplierId'])
export class Conversation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 3 })
  @Column({ name: 'restaurant_id', type: 'int' })
  restaurantId: number;

  @ApiProperty({ example: 5 })
  @Column({ name: 'supplier_id', type: 'int' })
  supplierId: number;

  @ApiProperty({ example: '2026-02-22T13:49:30.000Z' })
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-26T20:15:25.000Z', nullable: true })
  @Column({ name: 'last_message_at', type: 'datetime', nullable: true })
  lastMessageAt: Date | null;

  // -- Relations --

  // Chaque conversation est liée à un restaurant
  @ManyToOne(
    () => Establishment,
    (establishment) => establishment.conversations,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Establishment;

  // Chaque conversation est liée à un fournisseur
  @ManyToOne(
    () => Establishment,
    (establishment) => establishment.conversationsAsSupplier,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'supplier_id' })
  supplier: Establishment;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
