import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity('user')
@Index(['role'])
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'john@example.com' })
  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @ApiProperty({ example: 'Doe' })
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({ example: 'John' })
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({ example: UserRole.RESTAURANT, enum: UserRole })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ApiProperty({ example: '2026-01-28T10:30:00Z', nullable: true })
  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt: Date | null;

  @ApiProperty({ example: '2026-01-15T08:00:00Z' })
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // Relations
  @OneToOne(() => Restaurant, (restaurant) => restaurant.user)
  restaurant?: Restaurant;

  @OneToOne(() => Supplier, (supplier) => supplier.user)
  supplier?: Supplier;
}
