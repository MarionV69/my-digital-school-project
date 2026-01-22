import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoredFile } from './entities/stored-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoredFile])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
