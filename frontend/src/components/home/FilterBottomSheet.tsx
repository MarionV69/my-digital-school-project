import type { filtersType } from "@/types/filters.types";
import Filters from "./Filters";
import { Button } from "../ui/button";

type FiltersBottomSheetProps = {
  isOpen: boolean;
  filters: filtersType;
  onChange: (filters: filtersType) => void;
  onClose: () => void;
};

export default function FilterBottomSheet({
  isOpen,
  filters,
  onChange,
  onClose,
}: FiltersBottomSheetProps) {
  return (
    <>
      {/* Overlay sombre derrière le panneau */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Panneau */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl z-50 lg:hidden transition-transform duration-1000 ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h3>Filtres</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Contenu */}
        <div className="overflow-y-auto max-h-[70vh] p-4">
          <Filters filters={filters} onChange={onChange}></Filters>
        </div>

        {/* Bouton */}
        <div className="p-4">
          <Button className="w-full" onClick={onClose}>
            Appliquer les filtres
          </Button>
        </div>
      </div>
    </>
  );
}
