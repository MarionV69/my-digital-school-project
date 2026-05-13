import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import useLabels from "@/hooks/useLabels";
import type { ProfilSupplierValuesType } from "@/types/profile.types";
import ShieldIcon from "@/assets/icons/shield.svg";

type LabelsProps = {
  supplierEditionValues: ProfilSupplierValuesType;
  patchSupplier: (
    fieldName: string,
    value: string | string[] | number | number[] | boolean | null,
  ) => Promise<void>;
};

export default function LabelsSection({
  supplierEditionValues,
  patchSupplier,
}: LabelsProps) {
  const { labels, loading, error } = useLabels();
  const labelsIds = supplierEditionValues.labels as number[];

  function handleClickLabel(label: { id: number }) {
    if (labelsIds.includes(label.id)) {
      patchSupplier(
        "labels",
        labelsIds.filter((c) => c !== label.id),
      );
    } else {
      patchSupplier("labels", [...labelsIds, label.id]);
    }
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="labels">
        <AccordionTrigger className="flex flex-row w-full gap-8 items-center">
          <div className="flex flex-row gap-2 items-center">
            <img className="size-4 opacity-70" src={ShieldIcon} />
            <p>Labels</p>
          </div>
          <span className="bg-black/50 text-white text-xs font-light px-2 py-1 rounded-full">
            Recommandé
          </span>
        </AccordionTrigger>
        <AccordionContent className="p-6 h-auto">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Plusieurs choix possibles</p>
            <div className="flex flex-row gap-2">
              {loading ? (
                <div className="flex flex-row w-full items-center justify-center">
                  <Spinner className="size-6 text-muted-foreground" />
                </div>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : (
                labels.map((label) => {
                  const isSelected = labelsIds.includes(label.id);
                  return (
                    <Badge
                      key={label.id}
                      className={isSelected ? "bg-primary text-white" : ""}
                    >
                      <button onClick={() => handleClickLabel(label)}>
                        {label.name}
                      </button>
                    </Badge>
                  );
                })
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
