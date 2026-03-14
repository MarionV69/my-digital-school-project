import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { LoggedUser, RegisterDto } from "../types/auth.types";
import { getProfile } from "../api/users";
import { loginApi, registerApi } from "../api/auth";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On page reload: fetch user from backend
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          const userData = await getProfile();

          setUser({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            establishmentId: userData.establishmentId,
            establishmentType: userData.establishmentType,
          });
        } catch (error) {
          console.error("Failed to fetch user", error);
          localStorage.removeItem("accessToken");
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const login = async (
    email: string,
    password: string,
  ): Promise<LoggedUser> => {
    const response = await loginApi(email, password);

    localStorage.setItem("accessToken", response.access_token);

    const userData = response.user;
    const loggedUser: LoggedUser = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      establishmentId: userData.establishmentId,
      establishmentType: userData.establishmentType,
    };
    setUser(loggedUser);

    return loggedUser;
  };

  // Register
  const register = async (dto: RegisterDto): Promise<LoggedUser> => {
    const response = await registerApi(dto);

    localStorage.setItem("accessToken", response.access_token);

    const userData = response.user;
    const registeredUser: LoggedUser = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      establishmentId: userData.establishmentId,
      establishmentType: userData.establishmentType,
    };
    setUser(registeredUser);

    return registeredUser;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
