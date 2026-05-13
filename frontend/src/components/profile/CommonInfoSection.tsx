import type { Dispatch, SetStateAction } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import type { FieldErrorsType, ProfileValuesType } from "@/types/profile.types";
import { Textarea } from "../ui/textarea";

type CommonInfoSectionType = {
  editionValues: ProfileValuesType;
  setEditionValues: Dispatch<SetStateAction<ProfileValuesType>>;
  apiValues: ProfileValuesType;
  patchEstablishment: (fieldName: string, value: string) => Promise<void>;
  fieldErrors: FieldErrorsType;
};

export default function CommonInfoSection({
  editionValues,
  setEditionValues,
  apiValues,
  patchEstablishment,
  fieldErrors,
}: CommonInfoSectionType) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="common-informations">
        <AccordionTrigger className="flex flex-row w-full gap-8 items-center">
          <p>Informations générales</p>
          <span className="bg-black/50 text-white text-xs font-light px-2 py-1 rounded-full">
            Recommandé
          </span>
        </AccordionTrigger>
        <AccordionContent className="p-6 h-auto">
          <div className="flex flex-col gap-4">
            {/* Identité */}
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground">IDENTITÉ</p>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-0.5 w-full">
                  <p>Raison sociale (nom légal) *</p>
                  <Input
                    value={editionValues.legalName}
                    onChange={(e) =>
                      setEditionValues({
                        ...editionValues,
                        legalName: e.target.value,
                      })
                    }
                    onBlur={() => {
                      if (editionValues.legalName !== apiValues.legalName) {
                        patchEstablishment(
                          "legalName",
                          editionValues.legalName,
                        );
                      }
                    }}
                    required
                  />
                  {fieldErrors.legalName && (
                    <p className="text-destructive text-xs">
                      {fieldErrors.legalName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 w-full">
                  <p>Nom commercial</p>
                  <Input
                    value={editionValues.tradeName || ""}
                    onChange={(e) =>
                      setEditionValues({
                        ...editionValues,
                        tradeName: e.target.value,
                      })
                    }
                    onBlur={() => {
                      if (editionValues.tradeName !== apiValues.tradeName) {
                        patchEstablishment(
                          "tradeName",
                          editionValues.tradeName,
                        );
                      }
                    }}
                    placeholder="Le Bouchon Lyonnais"
                  />
                  {fieldErrors.tradeName && (
                    <p className="text-destructive text-xs">
                      {fieldErrors.tradeName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-0.5 w-full">
                  <p>SIRET *</p>
                  <Input
                    value={editionValues.siret}
                    onChange={(e) =>
                      setEditionValues({
                        ...editionValues,
                        siret: e.target.value,
                      })
                    }
                    onBlur={() => {
                      if (editionValues.siret !== apiValues.siret) {
                        patchEstablishment("siret", editionValues.siret);
                      }
                    }}
                    required
                  />
                  {fieldErrors.siret && (
                    <p className="text-destructive text-xs">
                      {fieldErrors.siret}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 w-full">
                  <p>Numéro de TVA</p>
                  <Input
                    value={editionValues.vatNumber || ""}
                    onChange={(e) =>
                      setEditionValues({
                        ...editionValues,
                        vatNumber: e.target.value,
                      })
                    }
                    onBlur={() => {
                      if (editionValues.vatNumber !== apiValues.vatNumber) {
                        patchEstablishment(
                          "vatNumber",
                          editionValues.vatNumber,
                        );
                      }
                    }}
                    placeholder="FR 12 345678901"
                  />
                  {fieldErrors.vatNumber && (
                    <p className="text-destructive text-xs">
                      {fieldErrors.vatNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Coordonées */}
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground">COORDONÉES</p>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-0.5 w-full">
                  <p>Téléphone</p>
                  <Input
                    value={editionValues.phone || ""}
                    onChange={(e) =>
                      setEditionValues({
                        ...editionValues,
                        phone: e.target.value,
                      })
                    }
                    onBlur={() => {
                      if (editionValues.phone !== apiValues.phone) {
                        patchEstablishment("phone", editionValues.phone);
                      }
                    }}
                    placeholder="06 12 34 56 78"
                  />
                  {fieldErrors.phone && (
                    <p className="text-destructive text-xs">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 w-full">
                  <p>Site web</p>
                  <Input
                    value={editionValues.website || ""}
                    onChange={(e) =>
                      setEditionValues({
                        ...editionValues,
                        website: e.target.value,
                      })
                    }
                    onBlur={() => {
                      if (editionValues.website !== apiValues.website) {
                        patchEstablishment("website", editionValues.website);
                      }
                    }}
                    placeholder="https://monrestaurant.fr"
                  />
                  {fieldErrors.website && (
                    <p className="text-destructive text-xs">
                      {fieldErrors.website}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground">ADRESSE</p>
              <div className="flex flex-col gap-0.5 w-full">
                <p>Adresse *</p>
                <Input
                  value={editionValues.address}
                  onChange={(e) =>
                    setEditionValues({
                      ...editionValues,
                      address: e.target.value,
                    })
                  }
                  onBlur={() => {
                    if (editionValues.address !== apiValues.address) {
                      patchEstablishment("address", editionValues.address);
                    }
                  }}
                  required
                />
                {fieldErrors.address && (
                  <p className="text-destructive text-xs">
                    {fieldErrors.address}
                  </p>
                )}
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-0.5 w-full">
                  <p>Code postal *</p>
                  <Input
                    value={editionValues.postalCode}
                    onChange={(e) =>
                      setEditionValues({
                        ...editionValues,
                        postalCode: e.target.value,
                      })
                    }
                    onBlur={() => {
                      if (editionValues.postalCode !== apiValues.postalCode) {
                        patchEstablishment(
                          "postalCode",
                          editionValues.postalCode,
                        );
                      }
                    }}
                    required
                  />
                  {fieldErrors.postalCode && (
                    <p className="text-destructive text-xs">
                      {fieldErrors.postalCode}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 w-full">
                  <p>Ville *</p>
                  <Input
                    value={editionValues.city}
                    onChange={(e) =>
                      setEditionValues({
                        ...editionValues,
                        city: e.target.value,
                      })
                    }
                    onBlur={() => {
                      if (editionValues.city !== apiValues.city) {
                        patchEstablishment("city", editionValues.city);
                      }
                    }}
                    required
                  />
                  {fieldErrors.city && (
                    <p className="text-destructive text-xs">
                      {fieldErrors.city}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 w-full">
                  <p>Pays *</p>
                  <Input
                    value={editionValues.country}
                    onChange={(e) =>
                      setEditionValues({
                        ...editionValues,
                        country: e.target.value,
                      })
                    }
                    onBlur={() => {
                      if (editionValues.country !== apiValues.country) {
                        patchEstablishment("country", editionValues.country);
                      }
                    }}
                    required
                  />
                  {fieldErrors.country && (
                    <p className="text-destructive text-xs">
                      {fieldErrors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground">PRÉSENTATION</p>
              <div className="flex flex-col gap-0.5 w-full">
                <p>Description</p>
                <Textarea
                  value={editionValues.description || ""}
                  onChange={(e) =>
                    setEditionValues({
                      ...editionValues,
                      description: e.target.value,
                    })
                  }
                  onBlur={() => {
                    if (editionValues.description !== apiValues.description) {
                      patchEstablishment(
                        "description",
                        editionValues.description,
                      );
                    }
                  }}
                  placeholder="Décrivez votre activité, vos valeurs, etc."
                />
                {fieldErrors.description && (
                  <p className="text-destructive text-xs">
                    {fieldErrors.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
