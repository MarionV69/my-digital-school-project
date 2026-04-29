import { createContext } from "react";
import type { LoggedUser, RegisterDto } from "../types/auth.types";

export type AuthContextType = {
  user: LoggedUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoggedUser>;
  register: (dto: RegisterDto) => Promise<LoggedUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
