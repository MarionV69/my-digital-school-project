import { initialErrors, initialValues } from "@/types/profile.types";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import api from "@/api/axiosConfig";
import type { FieldErrorsType } from "@/types/profile.types";
import type { AxiosError } from "axios";

export default function useEstablishment() {
  const { user } = useAuth();
  const establishmentId = user?.establishmentId;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Valeurs modifiées à chaque frappe de l'utilisateur
  const [editionValues, setEditionValues] = useState(initialValues);
  // Valeurs modifiées au GET
  const [apiValues, setApiValues] = useState(initialValues);

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrorsType>(initialErrors);

  // useEffect pour récupérer les informations de l'établissement lors du premier rendu
  useEffect(() => {
    if (!establishmentId) return;
    async function getCurrentValues() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/establishments/${establishmentId}`);
        setApiValues(response.data);
        setEditionValues(response.data);
      } catch {
        setError(
          "Erreur lors du chargement des informations de l'établissement. Veuillez réessayer plus tard.",
        );
      } finally {
        setLoading(false);
      }
    }
    getCurrentValues();
  }, [establishmentId]);

  // Fonction pour modifier le champs concerné
  async function patchEstablishment(fieldName: string, value: string) {
    try {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: null }));
      const response = await api.patch(`/establishments/${establishmentId}`, {
        [fieldName]: value,
      });
      setApiValues(response.data);
      setEditionValues(response.data);
    } catch (e) {
      const error = e as AxiosError<{ message: string[] }>;
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: error.response?.data.message.join(", ") ?? null,
      }));
      setEditionValues((prev) => ({
        ...prev,
        [fieldName]: apiValues[fieldName as keyof typeof apiValues],
      }));
    }
  }

  return {
    editionValues,
    setEditionValues,
    apiValues,
    error,
    loading,
    patchEstablishment,
    fieldErrors,
  };
}
