import type { CreateSupplierAttributesDto } from "../types/suppliers.types";
import api from "./axiosConfig";

export const createSupplierAttributes = async (
  dto: CreateSupplierAttributesDto,
): Promise<void> => {
  await api.post("/suppliers", dto);
};
