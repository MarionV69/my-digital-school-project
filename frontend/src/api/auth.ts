import type { AuthResponse, RegisterDto } from "../types/auth.types";
import api from "./axiosConfig";

export const loginApi = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerApi = async (dto: RegisterDto): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", dto);
  return response.data;
};
