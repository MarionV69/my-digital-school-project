import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/enums/user-role.enum';
import { EstablishmentType } from '../../establishments/enums/establishment-type.enum';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    example: {
      id: 1,
      role: UserRole.OWNER,
      establishmentId: 3,
      establishmentType: 'RESTAURANT',
    },
  })
  user: {
    id: number;
    role: UserRole;
    firstName: string;
    lastName: string;
    establishmentId: number | null;
    establishmentType: EstablishmentType | null;
  };
}
