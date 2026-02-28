import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@ApiTags('establishments')
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  // Routes pour créer un établissement
  @Post()
  create(
    @Body() createEstablishmentDto: CreateEstablishmentDto,
    @Request() req: Request & { user: AuthenticatedUser },
  ) {
    return this.establishmentsService.create(createEstablishmentDto, req.user);
  }

  // Route pour récupérer tous les établissements
  @Get()
  findAll(@Request() req: Request & { user: AuthenticatedUser }) {
    return this.establishmentsService.findAll(req.user);
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
