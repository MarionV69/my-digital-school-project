import type { Supplier } from "@/types/supplier";
import type {
  CreateSupplierAttributesDto,
  SupplierStatsDto,
} from "../types/suppliers.types";
import api from "./axiosConfig";

export const createSupplierAttributes = async (
  dto: CreateSupplierAttributesDto,
): Promise<void> => {
  await api.post("/suppliers", dto);
};

export const getSupplierStats = async (
  supplierId: number,
): Promise<SupplierStatsDto> => {
  const response = await api.get<SupplierStatsDto>(
    `/suppliers/${supplierId}/stats`,
  );
  return response.data;
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>("/suppliers");
  return response.data;
};
