import type { ProfilSupplierValuesType, SupplierFieldErrorsType } from "@/types/profile.types";
import CategoriesSection from "./supplier-extras/CategoriesSection";
import DeliverySection from "./supplier-extras/DeliverySection";
import LabelsSection from "./supplier-extras/LabelsSection";
import VisibilitySection from "./supplier-extras/VisibilitySection";
import type { Dispatch, SetStateAction } from "react";

type SupplierExtrasType ={
  supplierEditionValues: ProfilSupplierValuesType,
  supplierSetEditionValues: Dispatch<SetStateAction<ProfilSupplierValuesType>>,
  supplierApiValues: ProfilSupplierValuesType,
  patchSupplier: (fieldName: string, value: string | string[] | number | number[] | boolean | null) => Promise<void>,
  supplierFieldErrors: SupplierFieldErrorsType,
}

export default function SupplierExtras({supplierEditionValues, supplierSetEditionValues, supplierApiValues, patchSupplier, supplierFieldErrors}: SupplierExtrasType) {
  return (
    <>
      <CategoriesSection 
        supplierEditionValues={supplierEditionValues}
        patchSupplier={patchSupplier}
      />
      <LabelsSection />
      <DeliverySection />
      <LabelsSection />
      <VisibilitySection />
    </>
  );
}
