import { Document } from '../../documents/entities/document.entity';
import { Message } from '../../conversations/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('stored_file')
export class StoredFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'original_filename', type: 'varchar', length: 255 })
  originalFilename: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 50 })
  mimeType: string;

  @Column({ type: 'int' })
  size: number; // Size of the file in bytes

  @Column({ type: 'varchar', length: 512 })
  path: string; // S3 key (e.g. "public/6de0c398-ea33-445b-aa55-84fe94ed3907.jpg")

  @CreateDateColumn({ name: 'uploaded_at', type: 'datetime' })
  uploadedAt: Date;

  // Relations
  @OneToMany(() => Document, (doc) => doc.file)
  documents: Document[];

  @ManyToMany(() => Message, (message) => message.files)
  messages: Message[];
}
