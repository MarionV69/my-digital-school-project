import { useState, useEffect, type ReactNode } from "react";

import { AuthContext, type User } from "./AuthContext";
import api from "../api/axiosConfig";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On page reload: fetch user from backend
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          const response = await api.get("/users/me");
          const userData = response.data;

          setUser({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            establishmentId: userData.establishmentId,
            establishmentType: userData.establishment?.type || null,
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
  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });

    localStorage.setItem("accessToken", response.data.access_token);

    const userData = response.data.user;
    const loggedUser: User = {
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

  // Logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
