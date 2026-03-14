import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class ProfileResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john@restaurant.com' })
  email: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: UserRole.OWNER, enum: UserRole })
  role: UserRole;

  @ApiProperty({ example: 3, nullable: true })
  establishmentId: number | null;

  @ApiProperty({ example: '2026-01-28T10:30:00Z', nullable: true })
  lastLoginAt: Date | null;

  @ApiProperty({ example: '2026-01-15T08:00:00Z' })
  createdAt: Date;
}
