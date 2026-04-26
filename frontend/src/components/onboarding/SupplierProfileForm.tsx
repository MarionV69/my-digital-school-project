import { createSupplierAttributes } from "@/api/suppliers";
import { PriceRange, SupplierType } from "@/types/suppliers.types";
import axios from "axios";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

type SupplierProfileFormData = {
  supplierType: SupplierType | "";
  priceRange: PriceRange | "";
};

type SupplierProfileErrors = {
  supplierType?: string;
  priceRange?: string;
  general?: string;
};

function SupplierProfileForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SupplierProfileFormData>({
    supplierType: "",
    priceRange: "",
  });
  const [errors, setErrors] = useState<SupplierProfileErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSupplierTypeChange = (value: SupplierType) => {
    setFormData((prev) => ({ ...prev, supplierType: value }));
    if (errors.supplierType)
      setErrors((prev) => ({ ...prev, supplierType: undefined }));
  };

  const handlePriceRangeChange = (value: PriceRange) => {
    setFormData((prev) => ({ ...prev, priceRange: value }));
    if (errors.priceRange)
      setErrors((prev) => ({ ...prev, priceRange: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { supplierType, priceRange } = formData;

    setErrors({});
    const newErrors: SupplierProfileErrors = {};

    if (!supplierType)
      newErrors.supplierType = "Veuillez sélectionner un type de fournisseur.";
    if (!priceRange)
      newErrors.priceRange = "Veuillez sélectionner une fourchette de prix.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await createSupplierAttributes({
        supplierType: supplierType as SupplierType,
        priceRange: priceRange as PriceRange,
      });

      navigate("/onboarding/confirmation");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setErrors({
          general: "Une erreur est survenue. Vérifiez vos informations.",
        });
      } else {
        toast.error("Une erreur est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {errors.general && (
        <p className="text-sm text-destructive mb-2">{errors.general}</p>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <FieldGroup>
          {/* Supplier type */}
          <Field data-invalid={!!errors.supplierType}>
            <FieldLabel htmlFor="supplierType">
              Type de fournisseur *
            </FieldLabel>
            <Select
              value={formData.supplierType}
              onValueChange={handleSupplierTypeChange}
              disabled={isLoading}
            >
              <SelectTrigger
                id="supplierType"
                className="w-full"
                aria-invalid={!!errors.supplierType}
              >
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={SupplierType.PRODUCER}>
                    Producteur
                  </SelectItem>
                  <SelectItem value={SupplierType.WHOLESALER}>
                    Grossiste
                  </SelectItem>
                  <SelectItem value={SupplierType.RESELLER}>
                    Revendeur
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError>{errors.supplierType}</FieldError>
          </Field>

          {/* Price range */}
          <Field data-invalid={!!errors.priceRange}>
            <FieldLabel htmlFor="priceRange">Fourchette de prix *</FieldLabel>
            <Select
              value={formData.priceRange}
              onValueChange={handlePriceRangeChange}
              disabled={isLoading}
            >
              <SelectTrigger
                id="priceRange"
                className="w-full"
                aria-invalid={!!errors.priceRange}
              >
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={PriceRange.ECONOMIC}>
                    Économique
                  </SelectItem>
                  <SelectItem value={PriceRange.MID_RANGE}>
                    Milieu de gamme
                  </SelectItem>
                  <SelectItem value={PriceRange.PREMIUM}>Premium</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError>{errors.priceRange}</FieldError>
          </Field>

          {/* Info message */}
          <FieldDescription className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            Une fois votre compte créé, complétez votre fiche avec vos
            catégories, labels, documents et réseaux sociaux pour apparaître en
            tête des résultats.
          </FieldDescription>
        </FieldGroup>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/onboarding/create-establishment")}
            disabled={isLoading}
          >
            Retour
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Validation..." : "Valider"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SupplierProfileForm;
