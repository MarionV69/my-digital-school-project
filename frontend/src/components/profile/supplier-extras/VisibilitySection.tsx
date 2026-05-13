import { Switch } from "@/components/ui/switch";
import type { ProfilSupplierValuesType } from "@/types/profile.types";

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
      <p className="text-sm font-semibold">Visibilité du profil</p>
      <div className="flex flex-row items-center gap-1">
        {supplierEditionValues.isVisible ? (
          <label className="font-normal text-sm">Profil visible</label>
        ) : (
          <label className="font-normal text-sm">Profil invisible</label>
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
