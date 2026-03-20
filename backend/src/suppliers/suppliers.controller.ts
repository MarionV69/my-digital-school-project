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
import { ApiBearerAuth, ApiExcludeEndpoint, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { LabelDto } from './dto/label.dto';
import { FilterDto } from './dto/supplier-filter.dto';
import { SupplierDetailDto } from './dto/supplier-details.dto';
import { SupplierListItemDto } from './dto/supplier-list-item.dto';


@ApiTags('suppliers')
@ApiBearerAuth()
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  // GET /labels
  @Get('labels')
  @ApiOperation({ summary: 'Get all labels.'})
  @ApiOkResponse({ type: [LabelDto]})
  findAllLabels(): Promise<LabelDto[]> {
    return this.suppliersService.findAllLabels()
  }

  // GET /categories
  @Get('categories')
  @ApiOperation({ summary: 'Get all categories of product.'})
  @ApiOkResponse({ type: [CategoryDto]})
  findAllCategories(): Promise<CategoryDto[]> {
    return this.suppliersService.findAllCategories();
  }

  // POST /supplier
  @Post()
  @ApiExcludeEndpoint()
  create(@Body() createSupplierDto: CreateSupplierAttributesDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  // GET /suppliers?filtres
  @Get()
  @ApiOperation({ summary: 'Get all suppliers with optional filters' })
  @ApiOkResponse({ type: [SupplierListItemDto]})
  findAll(@Query() filters: FilterDto) {
    return this.suppliersService.findAll(filters);
  }

  // GET /suppliers/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get a supplier by id'})
  @ApiOkResponse({ type: SupplierDetailDto })
  findOne(@Param('id') id: number): Promise<SupplierDetailDto> {
    return this.suppliersService.findOne(+id);
  }

  // PATCH /suppliers/:id
  @Patch(':id')
  @ApiOperation({ summary: 'Make changes on a supplier'})
  @ApiOkResponse({ type: SupplierDetailDto })
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierAttributesDto,
  ) {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  // DELETE /supplier/:id
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a supplier'})
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }

}
