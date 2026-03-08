import { ApiProperty } from '@nestjs/swagger';
import { EstablishmentType } from 'src/establishments/enums/establishment-type.enum';
import { ProfileResponseDto } from './profile-response.dto';

export class ProfileWithEstablishmentTypeResponseDto extends ProfileResponseDto {
  @ApiProperty({
    example: 'RESTAURANT',
    enum: EstablishmentType,
    nullable: true,
  })
  establishmentType: EstablishmentType | null;
}
