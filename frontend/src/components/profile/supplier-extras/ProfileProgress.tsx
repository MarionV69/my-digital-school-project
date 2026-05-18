import SupplierProfileForm from "@/components/onboarding/SupplierProfileForm";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import type {
  ProfileValuesType,
  ProfilSupplierValuesType,
} from "@/types/profile.types";

type ProfileProgressType = {
  editionValues: ProfileValuesType;
  supplierEditionValues: ProfilSupplierValuesType;
};

export default function ProfileProgress({
  editionValues,
  supplierEditionValues,
}: ProfileProgressType) {

    const fields = [
        // Etablissement
        !!editionValues.legalName,
        !!editionValues.tradeName,
        !!editionValues.siret,
        !!editionValues.vatNumber,
        !!editionValues.phone,
        !!editionValues.website,
        !!editionValues.postalCode,
        !!editionValues.city,
        !!editionValues.country,
        !!editionValues.description,
        !!editionValues.facebook,
        !!editionValues.instagram,
        // Fournisseur
        supplierEditionValues.productCategories.length > 0,
        supplierEditionValues.labels.length > 0,
        !!supplierEditionValues.supplierType,
        !!supplierEditionValues.priceRange,
        !!supplierEditionValues.deliveryRadiusKm,
        !!supplierEditionValues.deliveryInformation,
        !!supplierEditionValues.minimumOrderAmount,
        !!supplierEditionValues.logoUrl,
        !!supplierEditionValues.coverPhotoUrl,
        supplierEditionValues.galleryPhotos.length > 0,
        supplierEditionValues.catalogs.length > 0,
    ];

    const completed = fields.filter(Boolean).length;
    const rate = Math.round((completed / fields.length) * 100);

  return (
    <Field className="w-full">
        <FieldLabel htmlFor="progress-upload" className="flex flex-row w-full justify-between">
            <span></span>
            <p className="text-muted-foreground">{rate}%</p>
        </FieldLabel>
        <Progress value={rate} id="progress-upload" />
    </Field>
    
  );
}
