import api from "@/api/axiosConfig";
import type { filtersType } from "@/types/filters.types";
import type { Supplier } from "@/types/supplier";
import { useEffect, useState } from "react";

export function useSuppliers(
  search: string,
  city: string,
  filters: filtersType,
) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setError(null);
      setLoading(true);

      const params: Record<string, string | number | boolean | string[]> = {};

      if (search) params.search = search;
      if (city) params.city = city;
      if (filters.productCategories.length > 0)
        params.productCategories = filters.productCategories;
      if (filters.labels.length > 0) params.labels = filters.labels;
      if (filters.minRating > 0) params.minRating = filters.minRating;
      if (filters.isPremium) params.isPremium = filters.isPremium;
      if (filters.supplierTypes.length > 0)
        params.supplierTypes = filters.supplierTypes;

      try {
        const response = await api.get<Supplier[]>("/suppliers", {
          params,
          paramsSerializer: (params) => {
            // Transforme l'objet params en un tableau de paires [clé, valeur]
            return Object.entries(params)
              .map(([key, value]) => {
                if (Array.isArray(value)) {
                  return value
                    .map((v) => `${key}=${encodeURIComponent(v)}`)
                    .join("&");
                }
                return `${key}=${encodeURIComponent(value)}`;
              })
              .join("&");
          },
        });
        setSuppliers(response.data);
      } catch {
        setError(
          "Impossible de charger les fournisseurs. Veuillez réessayer plus tard.",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, city, filters]);

  return { suppliers, error, loading };
}
