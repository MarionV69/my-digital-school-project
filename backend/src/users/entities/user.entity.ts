import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { Establishment } from '../../establishments/entities/establishment.entity';

@Entity('user')
@Index(['role'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'establishment_id', type: 'int', nullable: true })
  establishmentId: number | null;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // -- Relations --

  // Chaque utilisateur peut être lié à un établissement (restaurant ou fournisseur)
  @ManyToOne(() => Establishment, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'establishment_id' })
  establishment: Establishment | null;
}
