import { createContext } from "react";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: "OWNER" | "EMPLOYEE" | "ADMIN";
  establishmentId: number | null;
  establishmentType: "RESTAURANT" | "SUPPLIER" | null;
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
