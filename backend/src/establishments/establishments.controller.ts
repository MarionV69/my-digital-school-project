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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('establishments')
@ApiBearerAuth()
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  // Routes pour créer un établissement
  @Post()
  create(
    @Body() createEstablishmentDto: CreateEstablishmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.establishmentsService.create(createEstablishmentDto, user);
  }

  // Route pour récupérer tous les établissements
  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser,) {
    return this.establishmentsService.findAll(user);
  }

  // Route pour récupérer un établissement par son ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.establishmentsService.findOne(+id,);
  }

  // Route pour mettre à jour un établissement
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.establishmentsService.update(+id, updateEstablishmentDto, user);
  }

  // Route pour supprimer un établissement
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.establishmentsService.remove(+id, user);
  }
}
