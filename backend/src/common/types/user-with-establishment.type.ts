import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { EstablishmentType } from '../../establishments/enums/establishment-type.enum';

export type UserWithEstablishment = AuthenticatedUser & {
  establishmentId: number;
  establishmentType: EstablishmentType;
};
