import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { EstablishmentDetailsDto } from './dto/establishment-details.dto';
import { EstablishmentPreviewDto } from './dto/establishment-preview.dto';

@ApiTags('establishments')
@ApiBearerAuth()
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  // POST /establishments
  @Post()
  @ApiOperation({ summary: 'Create a new establishment.' })
  @ApiCreatedResponse()
  create(
    @Body() dto: CreateEstablishmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.establishmentsService.create(dto, user);
  }

  // GET /establishments/:id/preview
  @Get(':id/preview')
  @ApiOperation({ summary: 'Get a preview of a specific establishment by ID.' })
  @ApiOkResponse({ type: EstablishmentPreviewDto })
  findPreview(@Param('id') id: string): Promise<EstablishmentPreviewDto> {
    return this.establishmentsService.findPreview(+id);
  }

  // GET /establishments/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific establishment by ID.' })
  @ApiOkResponse({ type: EstablishmentDetailsDto })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<EstablishmentDetailsDto> {
    return this.establishmentsService.findOne(+id, user);
  }

  // PATCH /establishments/:id
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing establishment by ID.' })
  @ApiOkResponse({ type: EstablishmentDetailsDto })
  update(
    @Param('id') id: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.establishmentsService.update(+id, updateEstablishmentDto, user);
  }

  // DELETE /establishments/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an establishment by ID.' })
  @ApiNoContentResponse()
  @HttpCode(204)
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.establishmentsService.remove(+id, user);
  }
}
