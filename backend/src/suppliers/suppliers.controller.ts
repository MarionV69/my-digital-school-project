import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierAttributesDto } from './dto/create-supplier-attributes.dto';
import { UpdateSupplierAttributesDto } from './dto/update-supplier-attributes.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { LabelDto } from './dto/label.dto';
import { FilterDto } from './dto/supplier-filter.dto';
import { SupplierDetailDto } from './dto/supplier-details.dto';
import { SupplierListItemDto } from './dto/supplier-list-item.dto';
import { SupplierStatsDto } from './dto/supplier-stats.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { Public } from 'src/common/decorators/public.decorator';


@ApiTags('suppliers')
@ApiBearerAuth()
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  // GET /labels
  @Public()
  @Get('labels')
  @ApiOperation({ summary: 'Get all labels.'})
  @ApiOkResponse({ type: [LabelDto]})
  findAllLabels(): Promise<LabelDto[]> {
    return this.suppliersService.findAllLabels()
  }

  // GET /categories
  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all categories of product.'})
  @ApiOkResponse({ type: [CategoryDto]})
  findAllCategories(): Promise<CategoryDto[]> {
    return this.suppliersService.findAllCategories();
  }

  // POST /supplier
  @Post()
  @ApiOperation({ summary: 'Create supplierAttributes'})
  @ApiCreatedResponse()
  create(
    @Body() createSupplierDto: CreateSupplierAttributesDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.suppliersService.create(createSupplierDto, user);
  }

  // GET /suppliers?filtres
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all suppliers with optional filters' })
  @ApiOkResponse({ type: [SupplierListItemDto]})
  findAll(@Query() filters: FilterDto) {
    return this.suppliersService.findAll(filters);
  }

  // GET /supplier/:id/stats
  @Get(':id/stats')
  @ApiOperation({ summary: 'Get a supplier by id and see all of the stats'})
  @ApiOkResponse({ type: SupplierStatsDto })
  findStats(@Param('id') id: string): Promise<SupplierStatsDto> {
    return this.suppliersService.findStats(+id);
  }

  // GET /suppliers/:id
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a supplier by id'})
  @ApiOkResponse({ type: SupplierDetailDto })
  findOne(@Param('id') id: string): Promise<SupplierDetailDto> {
    return this.suppliersService.findOne(+id);
  }

  // PATCH /suppliers/:id
  @Patch(':id')
  @ApiOperation({ summary: 'Make changes on a supplier'})
  @ApiOkResponse({ type: SupplierDetailDto })
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierAttributesDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.suppliersService.update(+id, updateSupplierDto, user);
  }

  // DELETE /supplier/:id
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a supplier'})
  @ApiNoContentResponse()
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.suppliersService.remove(+id, user);
  }

}
