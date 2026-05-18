import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type {
  ProfilSupplierValuesType,
  SupplierFieldErrorsType,
} from "@/types/profile.types";
import type { Dispatch, SetStateAction } from "react";
import TruckIcon from "@/assets/icons/truck.svg";

type DeliverySectionType = {
  supplierEditionValues: ProfilSupplierValuesType;
  supplierSetEditionValues: Dispatch<SetStateAction<ProfilSupplierValuesType>>;
  supplierApiValues: ProfilSupplierValuesType;
  patchSupplier: (
    fieldName: string,
    value: string | string[] | number | number[] | boolean | null,
  ) => Promise<void>;
  supplierFieldErrors: SupplierFieldErrorsType;
};

export default function DeliverySection({
  supplierEditionValues,
  supplierSetEditionValues,
  supplierApiValues,
  patchSupplier,
  supplierFieldErrors,
}: DeliverySectionType) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="delivery">
        <AccordionTrigger className="flex flex-row w-full gap-8 items-center">
        <div className="flex flex-row gap-2 items-center">
            <img className="size-4 opacity-70" src={TruckIcon} />
            <p>Livraison</p>
          </div>
          <span className="bg-black/10 text-muted-foreground text-xs font-light px-2 py-1 rounded-full">
            Optionnel
          </span>
        </AccordionTrigger>
        <AccordionContent className="p-6 h-auto">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex flex-col gap-0.5 w-full">
                <p>Type de fournisseur *</p>
                <NativeSelect
                  className="w-full"
                  value={supplierEditionValues.supplierType}
                  onChange={(e) =>
                    supplierSetEditionValues({
                      ...supplierEditionValues,
                      supplierType: e.target.value,
                    })
                  }
                  onBlur={() => {
                    if (
                      supplierEditionValues.supplierType !==
                      supplierApiValues.supplierType
                    ) {
                      patchSupplier(
                        "supplierType",
                        supplierEditionValues.supplierType,
                      );
                    }
                  }}
                  required
                >
                  <NativeSelectOption value="PRODUCER">
                    Producteur
                  </NativeSelectOption>
                  <NativeSelectOption value="RESELLER">
                    Revendeur
                  </NativeSelectOption>
                  <NativeSelectOption value="WHOLESALER">
                    Grossiste
                  </NativeSelectOption>
                </NativeSelect>
                {supplierFieldErrors.supplierType && (
                  <p className="text-destructive text-xs">
                    {supplierFieldErrors.supplierType}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-0.5 w-full">
                <p>Fourchette de prix *</p>
                <NativeSelect
                  className="w-full"
                  value={supplierEditionValues.priceRange}
                  onChange={(e) =>
                    supplierSetEditionValues({
                      ...supplierEditionValues,
                      priceRange: e.target.value,
                    })
                  }
                  onBlur={() => {
                    if (
                      supplierEditionValues.priceRange !==
                      supplierApiValues.priceRange
                    ) {
                      patchSupplier(
                        "priceRange",
                        supplierEditionValues.priceRange,
                      );
                    }
                  }}
                  required
                >
                  <NativeSelectOption value="ECONOMIC">
                    € - Économique{" "}
                  </NativeSelectOption>
                  <NativeSelectOption value="MID_RANGE">
                    €€ - Milieu de gamme
                  </NativeSelectOption>
                  <NativeSelectOption value="PREMIUM">
                    €€€ - Premium
                  </NativeSelectOption>
                </NativeSelect>
                {supplierFieldErrors.priceRange && (
                  <p className="text-destructive text-xs">
                    {supplierFieldErrors.priceRange}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex flex-col gap-0.5 w-full">
                <p>Zone de livraison (km)</p>
                <Input
                  value={supplierEditionValues.deliveryRadiusKm ?? ""}
                  onChange={(e) => {
                    supplierSetEditionValues({
                      ...supplierEditionValues,
                      deliveryRadiusKm: e.target.value
                        ? Number(e.target.value)
                        : null,
                    });
                  }}
                  onBlur={() => {
                    console.log('valeur au blur:', supplierEditionValues.deliveryRadiusKm);
                    console.log('valeur api:', supplierApiValues.deliveryRadiusKm);
                    if (
                      supplierEditionValues.deliveryRadiusKm !==
                      supplierApiValues.deliveryRadiusKm
                    ) {
                      patchSupplier(
                        "deliveryRadiusKm",
                        supplierEditionValues.deliveryRadiusKm,
                      );
                    }
                  }}
                  placeholder="50"
                />
                {supplierFieldErrors.deliveryRadiusKm && (
                  <p className="text-destructive text-xs">
                    {supplierFieldErrors.deliveryRadiusKm}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-0.5 w-full">
                <p>Commande minimum</p>
                <Input
                  value={supplierEditionValues.minimumOrderAmount ?? ""}
                  onChange={(e) => {
                    supplierSetEditionValues({
                      ...supplierEditionValues,
                      minimumOrderAmount: e.target.value
                        ? Number(e.target.value)
                        : null,
                    });
                  }}
                  onBlur={() => {
                    if (
                      supplierEditionValues.minimumOrderAmount !==
                      supplierApiValues.minimumOrderAmount
                    ) {
                      patchSupplier(
                        "minimumOrderAmount",
                        supplierEditionValues.minimumOrderAmount,
                      );
                    }
                  }}
                  placeholder="100"
                />
                {supplierFieldErrors.minimumOrderAmount && (
                  <p className="text-destructive text-xs">
                    {supplierFieldErrors.minimumOrderAmount}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-0.5 w-full">
              <p>Informations de livraison</p>
              <Textarea
                value={supplierEditionValues.deliveryInformation || ""}
                onChange={(e) =>
                  supplierSetEditionValues({
                    ...supplierEditionValues,
                    deliveryInformation: e.target.value,
                  })
                }
                onBlur={() => {
                  if (
                    supplierEditionValues.deliveryInformation !==
                    supplierApiValues.deliveryInformation
                  ) {
                    patchSupplier(
                      "deliveryInformation",
                      supplierEditionValues.deliveryInformation,
                    );
                  }
                }}
                placeholder="Ex: Livraison du lundi au vendredi de 8h à 18h"
              />
              {supplierFieldErrors.deliveryInformation && (
                <p className="text-destructive text-xs">
                  {supplierFieldErrors.deliveryInformation}
                </p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
