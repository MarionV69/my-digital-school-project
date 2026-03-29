import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoredFile } from './entities/stored-file.entity';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoredFile]), ConfigModule],
  providers: [FilesService, S3Service],
  exports: [FilesService],
})
export class FilesModule {}
