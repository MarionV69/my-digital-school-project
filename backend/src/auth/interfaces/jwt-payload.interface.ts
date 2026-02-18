import { EstablishmentType } from 'src/establishments/enums/establishment-type.enum';
import { UserRole } from '../../users/enums/user-role.enum';

export interface JwtPayload {
  sub: number; // user ID
  role: UserRole;
  establishmentId: number | null;
  establishmentType: EstablishmentType | null;
}
