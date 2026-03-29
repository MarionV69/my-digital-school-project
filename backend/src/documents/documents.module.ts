import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { FilesModule } from '../files/files.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';

@Module({
  imports: [FilesModule, TypeOrmModule.forFeature([Document])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
