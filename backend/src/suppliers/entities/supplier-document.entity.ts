import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocumentCategory } from '../enums/document-category.enum';
import { Supplier } from './supplier.entity';
import { StoredFile } from '../../files/entities/stored-file.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('supplier_document')
@Index('idx_supplier_document_category', ['category'])
export class SupplierDocument {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 12 })
  @Column({ name: 'supplier_id', type: 'int' })
  supplierId: number;

  @ApiProperty({ example: 45 })
  @Column({ name: 'file_id', type: 'int' })
  fileId: number;

  @ApiProperty({ example: DocumentCategory.LOGO, enum: DocumentCategory })
  @Column({ name: 'category', type: 'enum', enum: DocumentCategory })
  category: DocumentCategory;

  @ApiProperty({ example: '2026-02-12T10:00:00Z' })
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Supplier, (supplier) => supplier.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => StoredFile, (file) => file.supplierDocuments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'file_id' })
  file: StoredFile;
}
