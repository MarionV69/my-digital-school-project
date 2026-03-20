import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierAttributesDto } from './dto/create-supplier-attributes.dto';
import { UpdateSupplierAttributesDto } from './dto/update-supplier-attributes.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { LabelDto } from './dto/label.dto';
import { FilterDto } from './dto/supplier-filter.dto';


@ApiTags('suppliers')
@ApiBearerAuth()
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  create(@Body() createSupplierDto: CreateSupplierAttributesDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  findAll(@Query() filters: FilterDto) {
    return this.suppliersService.findAll(filters);
  }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierAttributesDto,
  ) {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }

}
