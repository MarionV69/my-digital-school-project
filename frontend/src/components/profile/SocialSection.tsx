import type { FieldErrorsType, ProfileValuesType } from "@/types/profile.types";
import type { Dispatch, SetStateAction } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";

type SocialSectionType = {
  editionValues: ProfileValuesType;
  setEditionValues: Dispatch<SetStateAction<ProfileValuesType>>;
  apiValues: ProfileValuesType;
  patchEstablishment: (fieldName: string, value: string) => Promise<void>;
  fieldErrors: FieldErrorsType;
};

export default function SocialSection({
  editionValues,
  setEditionValues,
  apiValues,
  patchEstablishment,
  fieldErrors,
}: SocialSectionType) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="social-media">
        <AccordionTrigger className="flex flex-row w-full gap-8 items-center">
          <p>Réseaux sociaux</p>
          <span className="bg-black/10 text-muted-foreground text-xs font-light px-2 py-1 rounded-full">
            Optionnel
          </span>
        </AccordionTrigger>
        <AccordionContent className="p-6 h-auto">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-0.5 w-full">
                <p>Instagram</p>
                <Input
                  value={editionValues.instagram}
                  onChange={(e) =>
                    setEditionValues({
                      ...editionValues,
                      instagram: e.target.value,
                    })
                  }
                  onBlur={() => {
                    if (editionValues.instagram !== apiValues.instagram) {
                      patchEstablishment("instagram", editionValues.instagram);
                    }
                  }}
                  placeholder="@votre_compte"
                />
                {fieldErrors.instagram && (
                  <p className="text-destructive text-xs">
                    {fieldErrors.legalName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-0.5 w-full">
                <p>Facebook</p>
                <Input
                  value={editionValues.facebook}
                  onChange={(e) =>
                    setEditionValues({
                      ...editionValues,
                      facebook: e.target.value,
                    })
                  }
                  onBlur={() => {
                    if (editionValues.facebook !== apiValues.facebook) {
                      patchEstablishment("facebook", editionValues.facebook);
                    }
                  }}
                  placeholder="@votre_compte"
                />
                {fieldErrors.facebook && (
                  <p className="text-destructive text-xs">
                    {fieldErrors.tradeName}
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
