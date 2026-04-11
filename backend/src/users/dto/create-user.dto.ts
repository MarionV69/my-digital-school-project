import { IsEmail, IsString, MinLength, IsEnum, Matches } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'contact@legourmet-lyon.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    minLength: 12,
    example: 'Password123!',
    description:
      'Minimum 12 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial',
  })
  @IsString()
  @MinLength(12)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, {
    message:
      'Le mot de passe doit contenir au moins 12 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial',
  })
  password: string;

  @ApiProperty({ example: 'Dubois' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Pierre' })
  @IsString()
  firstName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.OWNER })
  @IsEnum(UserRole)
  role: UserRole;
}
