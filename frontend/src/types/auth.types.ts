import type { EstablishmentType } from "./establishments.types";
import type { UserRole } from "./users.types";

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "OWNER";
  acceptTerms: boolean;
};

export type AuthResponse = {
  access_token: string;
  user: LoggedUser;
};

export type LoggedUser = {
  id: number;
  firstName: string;
  lastName: string;
  role: UserRole;
  establishmentId: number | null;
  establishmentType: EstablishmentType | null;
};
