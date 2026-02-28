import { PartialType } from '@nestjs/swagger';
import { CreateSupplierAttributesDto } from './create-supplier-attributes.dto';

export class UpdateSupplierAttributesDto extends PartialType(
  CreateSupplierAttributesDto,
) {}
