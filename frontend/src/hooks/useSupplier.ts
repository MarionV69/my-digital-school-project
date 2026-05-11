import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import api from "@/api/axiosConfig";
import {
  initialSuppliersErrors,
  initialSuppliersValues,
  type SupplierFieldErrorsType,
} from "@/types/profile.types";
import type { AxiosError } from "axios";

export default function useSupplier() {
  const { user } = useAuth();
  const supplierId = user?.establishmentId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  // Valeurs présentes en BDD: ne change que quand le PATCH ou le GET réussit
  const [apiValues, setApiValues] = useState(initialSuppliersValues);
  // Représente ce que l'utilisateur est en train de taper: change à chaque frappe via onChange
  const [editionValues, setEditionValues] = useState(initialSuppliersValues);

  const [fieldErrors, setFieldErrors] = useState<SupplierFieldErrorsType>(
    initialSuppliersErrors,
  );

  // GET
  useEffect(() => {
    if (!supplierId) return;
    async function getCurrentSupplierValues() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/suppliers/${supplierId}`);
        setApiValues(response.data);
        setEditionValues(response.data);
      } catch {
        setError(
          "Erreur lors du chargement des informations de l'établissement. Veuillez réessayer plus tard. ",
        );
      } finally {
        setLoading(false);
      }
    }
    getCurrentSupplierValues();
  }, [supplierId]);

  // PATCH
  async function patchSupplier(
    fieldName: string,
    value: string | string[] | number | number[] | boolean | null,
  ) {
    if (!supplierId) return;
    try {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: null }));
      const response = await api.patch(`/suppliers/${supplierId}`, {
        [fieldName]: value,
      });
      const normalizedResponseData = {
        ...response.data,
        productCategories: response.data.productCategories.map(
          (cat: {id: number}) => cat.id,
        )
      };
      setApiValues(normalizedResponseData);
      setEditionValues(normalizedResponseData);
    } catch (e) {
      const axiosError = e as AxiosError<{ message: string[] }>;
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: axiosError.response?.data.message.join(", ") ?? null,
      }));
      // On remet EditionValues à la valeur de ApiValues car sans ça, si l'utilisateur retape la même valeur correcte qu'en base, la comparaison editionValues !== apiValues serait false et le PATCH ne partirait pas, donc l'erreur resterait affichée.
      setEditionValues((prev) => ({
        ...prev,
        [fieldName]: apiValues[fieldName as keyof typeof apiValues]
      }));
    }
  }

  // Retour
  return { loading, error, apiValues, editionValues, setEditionValues, patchSupplier, fieldErrors};
}
