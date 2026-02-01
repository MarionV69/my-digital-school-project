import { UserRole } from '../../users/enums/user-role.enum';

export interface AuthenticatedUser {
  id: number;
  role: UserRole;
}
