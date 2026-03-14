import type { User, UserWithEstablishmentType } from "../types/users.types";
import api from "./axiosConfig";

export const getProfile = async (): Promise<UserWithEstablishmentType> => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateProfile = async (data: {
  firstName?: string;
  lastName?: string;
}): Promise<User> => {
  const response = await api.patch("/users/me", data);
  return response.data;
};

export const deleteAccount = async (): Promise<void> => {
  await api.delete("/users/me");
};
