import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEstablishmentDto } from './create-establishment.dto';

export class UpdateEstablishmentDto extends PartialType(
  OmitType(CreateEstablishmentDto, ['type'] as const),
) {}
