import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/enums/user-role.enum';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    example: {
      id: 1,
      role: UserRole.RESTAURANT,
      isOnboardingCompleted: false,
    },
  })
  user: {
    id: number;
    role: UserRole;
    isOnboardingCompleted: boolean;
  };
}
