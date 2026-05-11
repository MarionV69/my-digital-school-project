import api from "@/api/axiosConfig";
import { useEffect, useState } from "react";

export default function useCategories() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getCategories() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/suppliers/categories`);
        setCategories(response.data);
      } catch {
        setError(
          "Erreur lors du chargement des catégories. Veuillez réessayer plus tard.",
        );
      } finally {
        setLoading(false);
      }
    }
    getCategories();
  }, []);

  return { categories, loading, error };
}
