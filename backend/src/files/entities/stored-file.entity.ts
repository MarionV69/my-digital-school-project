import { Message } from '../../conversations/entities/message.entity';
import { SupplierDocument } from '../../suppliers/entities/supplier-document.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('file')
export class StoredFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'original_filename', type: 'varchar', length: 255 })
  originalFilename: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 50 })
  mimeType: string;

  @Column({ type: 'varchar', length: 512 })
  path: string;

  @CreateDateColumn({ name: 'uploaded_at', type: 'datetime' })
  uploadedAt: Date;

  // Relations
  @OneToMany(() => SupplierDocument, (doc) => doc.file)
  supplierDocuments: SupplierDocument[];

  @ManyToMany(() => Message, (message) => message.files)
  messages: Message[];
}
