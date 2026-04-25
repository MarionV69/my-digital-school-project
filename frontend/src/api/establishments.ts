import type { EstablishmentPreview } from "../types/establishments.types";
import api from "./axiosConfig";

export const getEstablishmentPreview = async (
  id: number,
): Promise<EstablishmentPreview> => {
  const response = await api.get<EstablishmentPreview>(
    `/establishments/${id}/preview`,
  );
  return response.data;
};
