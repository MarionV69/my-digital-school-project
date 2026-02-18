import { EstablishmentType } from 'src/establishments/enums/establishment-type.enum';
import { UserRole } from '../../users/enums/user-role.enum';

export interface AuthenticatedUser {
  id: number;
  role: UserRole;
  establishmentId: number | null;
  establishmentType: EstablishmentType | null;
}
