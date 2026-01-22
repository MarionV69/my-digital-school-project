import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocumentCategory } from '../enums/document-category.enum';
import { Supplier } from './supplier.entity';
import { StoredFile } from 'src/files/entities/stored-file.entity';

@Entity('supplier_document')
@Index('idx_supplier_document_category', ['category'])
export class SupplierDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'supplier_id', type: 'int' })
  supplierId: number;

  @Column({ name: 'file_id', type: 'int' })
  fileId: number;

  @Column({ name: 'category', type: 'enum', enum: DocumentCategory })
  category: DocumentCategory;

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
  file: File;
}
