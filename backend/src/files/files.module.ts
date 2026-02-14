import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoredFile } from './entities/stored-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoredFile])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
