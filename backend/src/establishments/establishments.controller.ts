import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('establishments')
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  // Routes pour créer un établissement
  @Post()
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentsService.create(createEstablishmentDto);
  }

  // Route pour récupérer tous les établissements
  @Get()
  findAll() {
    return this.establishmentsService.findAll();
  }

  // Route pour récupérer un établissement par son ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.establishmentsService.findOne(+id);
  }

  // Route pour mettre à jour un établissement
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
  ) {
    return this.establishmentsService.update(+id, updateEstablishmentDto);
  }

  // Route pour supprimer un établissement
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.establishmentsService.remove(+id);
  }
}
