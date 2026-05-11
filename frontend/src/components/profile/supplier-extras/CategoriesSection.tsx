import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import useCategories from "@/hooks/useCategories";
import type { ProfilSupplierValuesType } from "@/types/profile.types";

type CategoriesSectionProps = {
  supplierEditionValues: ProfilSupplierValuesType;
  patchSupplier: (
    fieldName: string,
    value: string | string[] | number | number[] | boolean | null,
  ) => Promise<void>;
};

export default function CategoriesSection({
  supplierEditionValues,
  patchSupplier,
}: CategoriesSectionProps) {
  const { categories, loading, error } = useCategories();
  const productCategoriesIds =
    supplierEditionValues.productCategories as number[];

  function handleClickCategory(category: { id: number }) {
    if (productCategoriesIds.includes(category.id)) {
      patchSupplier(
        "productCategories",
        productCategoriesIds.filter((c) => c !== category.id),
      );
    } else {
      patchSupplier("productCategories", [
        ...productCategoriesIds,
        category.id,
      ]);
    }
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="categories">
        <AccordionTrigger className="flex flex-row w-full gap-8 items-center">
          <p>Catégories de produits</p>
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
                categories.map((category) => {
                  const isSelected = productCategoriesIds.includes(category.id);
                  return (
                    <Badge
                      key={category.id}
                      className={isSelected ? "bg-primary text-white" : ""}
                    >
                      <button onClick={() => handleClickCategory(category)}>
                        {category.name}
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
