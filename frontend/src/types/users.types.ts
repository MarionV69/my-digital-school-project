import type { EstablishmentType } from "./establishments.types";

export const UserRole = {
  OWNER: "OWNER",
  EMPLOYEE: "EMPLOYEE",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type UserWithEstablishmentType = User & {
  establishmentType: EstablishmentType | null;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  establishmentId: number | null;
  lastLoginAt: string | null;
  createdAt: string;
};
