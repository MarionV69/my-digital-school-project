import { ApiProperty } from '@nestjs/swagger';
import { EstablishmentType } from '../enums/establishment-type.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateEstablishmentDto {
  @ApiProperty({
    enum: EstablishmentType,
    example: EstablishmentType.RESTAURANT,
  })
  @IsEnum(EstablishmentType)
  @IsNotEmpty()
  type: EstablishmentType;

  @ApiProperty({ example: '12345678901234' })
  @IsString()
  @IsNotEmpty()
  @Length(14, 14)
  siret: string;

  @ApiProperty({ example: 'Le Gourmet' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  legalName: string;

  @ApiProperty({ example: 'Le Gourmet Bistro', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  tradeName?: string;

  @ApiProperty({ example: 'FR 32 123456789', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  vatNumber?: string;

  @ApiProperty({ example: 'j@example.com', required: false })
  @IsEmail()
  @IsOptional()
  @MaxLength(150)
  email?: string;

  @ApiProperty({ example: '+33123456789', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: '123 Rue de la Paix' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({ example: 'Paris' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: '75001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  postalCode: string;

  @ApiProperty({ example: 'France', default: 'France' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  country: string;

  @ApiProperty({ example: 48.856614, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 2.352222, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    example: 'A popular restaurant in the heart of the city.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  website?: string;

  @ApiProperty({ example: 'https://facebook.com/legourmet', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  facebook?: string;

  @ApiProperty({ example: 'https://instagram.com/legourmet', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  instagram?: string;
}
