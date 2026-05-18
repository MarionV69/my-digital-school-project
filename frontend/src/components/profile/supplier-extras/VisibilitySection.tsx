import { Switch } from "@/components/ui/switch";
import type { ProfilSupplierValuesType } from "@/types/profile.types";
import SunglassesIcon from "@/assets/icons/sunglasses.svg";

type VisibilitySectionType = {
  supplierEditionValues: ProfilSupplierValuesType;
  patchSupplier: (
    fieldName: string,
    value: string | string[] | number | number[] | boolean | null,
  ) => Promise<void>;
};

export default function VisibilitySection({
  supplierEditionValues,
  patchSupplier,
}: VisibilitySectionType) {
  return (
    <div className="flex flex-row p-6 items-center justify-between border-1 border-border rounded-lg bg-white">
    <div className="flex flex-row gap-2 items-center">
            <img className="size-4 opacity-70" src={SunglassesIcon} />
            <p className="text-sm font-semibold">Visibilité</p>
          </div>
      <div className="flex flex-row items-center gap-1">
        {supplierEditionValues.isVisible ? (
          <label className="font-thin text-sm text-muted-foreground">Profil visible</label>
        ) : (
          <label className="font-thin text-sm text-muted-foreground">Profil invisible</label>
        )}
        <Switch
          checked={supplierEditionValues.isVisible}
          onCheckedChange={(checked) => {
              patchSupplier("isVisible", checked);
          }}
        />
      </div>
    </div>
  );
}
