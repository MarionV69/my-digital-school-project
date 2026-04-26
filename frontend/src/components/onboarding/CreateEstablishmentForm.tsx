import { createEstablishment } from "@/api/establishments";
import { useAuth } from "@/hooks/useAuth";
import { EstablishmentType } from "@/types/establishments.types";
import {
  isNotEmptyString,
  isPhoneValid,
  isPostalCodeValid,
  isSiretValid,
} from "@/utils/validation";
import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";
import { ShoppingBasket, UtensilsCrossed } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type CreateEstablishmentFormData = {
  type: EstablishmentType | null;
  legalName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  siret: string;
  phone: string;
};

type CreateEstablishmentErrors = {
  type?: string;
  legalName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  siret?: string;
  phone?: string;
  general?: string;
};

function CreateEstablishmentForm() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState<CreateEstablishmentFormData>({
    type: null,
    legalName: "",
    address: "",
    postalCode: "",
    city: "",
    country: "France",
    siret: "",
    phone: "",
  });
  const [errors, setErrors] = useState<CreateEstablishmentErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof CreateEstablishmentErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle type change (for radio inputs)
  const handleTypeChange = (value: EstablishmentType) => {
    setFormData((prev) => ({ ...prev, type: value }));
    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const {
      type,
      legalName,
      address,
      postalCode,
      city,
      country,
      siret,
      phone,
    } = formData;

    // Reset errors
    setErrors({});

    const newErrors: CreateEstablishmentErrors = {};

    // Validate form data
    if (!type) {
      newErrors.type = "Veuillez sélectionner un type d'établissement.";
    }
    if (!isNotEmptyString(legalName))
      newErrors.legalName = "La raison sociale est requise.";
    if (!isNotEmptyString(address))
      newErrors.address = "L'adresse est requise.";

    if (!isNotEmptyString(postalCode)) {
      newErrors.postalCode = "Le code postal est requis.";
    } else if (
      country.toLowerCase() === "france" &&
      !isPostalCodeValid(postalCode)
    ) {
      newErrors.postalCode = "Le code postal doit contenir 5 chiffres.";
    }

    if (!isNotEmptyString(city)) newErrors.city = "La ville est requise.";

    if (!isNotEmptyString(siret)) {
      newErrors.siret = "Le SIRET est requis.";
    } else if (!isSiretValid(siret)) {
      newErrors.siret = "Le SIRET doit contenir 14 chiffres.";
    }

    if (phone && country.toLowerCase() === "france" && !isPhoneValid(phone)) {
      newErrors.phone = "Format invalide. Ex : 06 12 34 56 78";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    setIsLoading(true);

    try {
      await createEstablishment({
        type: type as EstablishmentType,
        legalName,
        address,
        postalCode,
        city,
        country,
        siret: siret.replace(/\s/g, ""),
        phone: phone || undefined,
      });

      await refreshUser();

      if (type === EstablishmentType.SUPPLIER) {
        navigate("/onboarding/supplier-profile");
      } else {
        navigate("/onboarding/confirmation");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setErrors({ siret: "Ce SIRET est déjà utilisé." });
        toast.error(
          "Ce SIRET est déjà associé à un compte. Contactez le support si nécessaire.",
        );
      } else {
        toast.error(
          "Une erreur est survenue lors de la création de l'établissement.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {errors.general && (
        <p className="text-destructive text-center mb-2">{errors.general}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <FieldGroup>
          {/* Establishment type selector */}
          <Field data-invalid={!!errors.type}>
            <RadioGroup
              value={formData.type}
              onValueChange={handleTypeChange}
              className="flex gap-4"
            >
              {/* Restaurant */}
              <FieldLabel htmlFor="restaurant">
                <div
                  className={cn(
                    "flex w-40 flex-col items-center gap-2 rounded-lg border p-4 pt-8 cursor-pointer transition-colors",
                    formData.type === EstablishmentType.RESTAURANT
                      ? "border-primary bg-muted"
                      : "border-muted-foreground/30 bg-white hover:border-primary/50 hover:bg-muted/50",
                  )}
                >
                  <UtensilsCrossed
                    className={cn(
                      "size-5",
                      formData.type === EstablishmentType.RESTAURANT
                        ? "text-primary"
                        : "text-primary-mid",
                    )}
                  />
                  <FieldContent className="items-center">
                    <FieldTitle className="text-sm">Restaurateur</FieldTitle>
                    <FieldDescription className="text-center text-xs">
                      Je cherche des fournisseurs
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value={EstablishmentType.RESTAURANT}
                    id="restaurant"
                    className="sr-only"
                  />
                </div>
              </FieldLabel>

              {/* Supplier */}
              <FieldLabel htmlFor="supplier">
                <div
                  className={cn(
                    "flex w-40 flex-col items-center gap-2 rounded-lg border p-4 pt-8 cursor-pointer transition-colors",
                    formData.type === EstablishmentType.SUPPLIER
                      ? "border-primary bg-muted"
                      : "border-muted-foreground/30 bg-white hover:border-primary/50 hover:bg-muted/50",
                  )}
                >
                  <ShoppingBasket
                    className={cn(
                      "size-5",
                      formData.type === EstablishmentType.SUPPLIER
                        ? "text-primary"
                        : "text-primary-mid",
                    )}
                  />
                  <FieldContent className="items-center">
                    <FieldTitle className="text-sm">Fournisseur</FieldTitle>
                    <FieldDescription className="text-center text-xs">
                      Je propose mes produits
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value={EstablishmentType.SUPPLIER}
                    id="supplier"
                    className="sr-only"
                  />
                </div>
              </FieldLabel>
            </RadioGroup>
            <FieldError>{errors.type}</FieldError>
          </Field>

          {/* Legal name */}
          <Field data-invalid={!!errors.legalName}>
            <FieldLabel htmlFor="legalName">
              Raison sociale (nom légal) *
            </FieldLabel>
            <Input
              id="legalName"
              name="legalName"
              placeholder="Le Bouchon Lyonnais"
              value={formData.legalName}
              onChange={handleChange}
              disabled={isLoading}
              aria-invalid={!!errors.legalName}
            />
            <FieldError>{errors.legalName}</FieldError>
          </Field>

          {/* Address */}
          <Field data-invalid={!!errors.address}>
            <FieldLabel htmlFor="address">Adresse *</FieldLabel>
            <Input
              id="address"
              name="address"
              placeholder="12 rue de la République"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
              aria-invalid={!!errors.address}
            />
            <FieldError>{errors.address}</FieldError>
          </Field>

          {/* Postal code + City + Country */}
          <div className="grid grid-cols-3 gap-3">
            <Field data-invalid={!!errors.postalCode}>
              <FieldLabel htmlFor="postalCode" className="sr-only">
                Code postal
              </FieldLabel>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="69230"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.postalCode}
              />
              <FieldError>{errors.postalCode}</FieldError>
            </Field>

            <Field data-invalid={!!errors.city}>
              <FieldLabel htmlFor="city" className="sr-only">
                Ville
              </FieldLabel>
              <Input
                id="city"
                name="city"
                placeholder="Lyon"
                value={formData.city}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.city}
              />
              <FieldError>{errors.city}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="country" className="sr-only">
                Pays
              </FieldLabel>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Field>
          </div>

          {/* SIRET + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!errors.siret}>
              <FieldLabel htmlFor="siret">SIRET *</FieldLabel>
              <Input
                id="siret"
                name="siret"
                placeholder="123 456 789 00012"
                value={formData.siret}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.siret}
              />
              <FieldError>{errors.siret}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
              <Input
                id="phone"
                name="phone"
                placeholder="06 12 34 56 78"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.phone}
              />
              <FieldError>{errors.phone}</FieldError>
            </Field>
          </div>
        </FieldGroup>

        {/* Submit button*/}
        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading
            ? "Création..."
            : formData.type === EstablishmentType.SUPPLIER
              ? "Continuer"
              : "Créer mon compte"}
        </Button>
      </form>
      <p className="mt-4 text-sm">
        Besoin de reprendre plus tard?{" "}
        <Link to="/" className="text-primary-mid font-bold">
          Quitter
        </Link>{" "}
        <span className="text-sm">
          - vous pourrez continuer en vous connectant
        </span>
      </p>
    </div>
  );
}
export default CreateEstablishmentForm;
