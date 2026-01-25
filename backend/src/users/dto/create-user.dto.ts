import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john@restaurant.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.RESTAURANT })
  @IsEnum(UserRole)
  role: UserRole;
}
