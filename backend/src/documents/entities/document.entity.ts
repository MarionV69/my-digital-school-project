import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocumentCategory } from '../enums/document.enum';
import { StoredFile } from '../../files/entities/stored-file.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Establishment } from '../../establishments/entities/establishment.entity';

@Entity('document')
@Index('idx_document_category', ['category'])
export class Document {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 12 })
  @Column({ name: 'establishment_id', type: 'int' })
  establishmentId: number;

  @ApiProperty({ example: 45 })
  @Column({ name: 'file_id', type: 'int' })
  fileId: number;

  @ApiProperty({ example: DocumentCategory.LOGO, enum: DocumentCategory })
  @Column({ type: 'enum', enum: DocumentCategory })
  category: DocumentCategory;

  @ApiProperty({ example: '2026-02-12T10:00:00Z' })
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // -- Relations --

  // Chaque document est lié à un établissement
  @ManyToOne(() => Establishment, (establishment) => establishment.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'establishment_id' })
  establishment: Establishment;

  // Chaque document est lié à un fichier stocké
  @ManyToOne(() => StoredFile, (file) => file.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'file_id' })
  file: StoredFile;
}
