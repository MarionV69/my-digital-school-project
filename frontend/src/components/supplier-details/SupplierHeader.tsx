import type { supplierDetails } from "@/types/supplierDetails.type"
import { Euro, Heart, MapPin, Star } from "lucide-react"
import { Badge } from "../ui/badge"
import { useState } from "react"
import ContactButton from "../conversations/ContactButton"

type SupplierHeaderProps = {
    supplier: supplierDetails, 
    categories: { id: number; name: string }[];
    allLabels: { id: number; name: string; description: string }[];
    isFavorite: boolean,
    onFavoriteToggle: () => void,
}

export default function SupplierHeader({supplier, categories, allLabels, isFavorite, onFavoriteToggle}: SupplierHeaderProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    function handleClickFavorite(e: React.MouseEvent) {
        e.preventDefault();
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
        onFavoriteToggle();
    }

    const priceRangeLabel: Record<string, string> = {
        MID_RANGE: "Milieu de gamme",
        PREMIUM: "Premium",
        ECONOMIC: "Économique",
    };

    return(
        <div className="gap-2 flex flex-col">
            <div className="flex flex-row gap-8 items-start justify-between">
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 items-start lg:items-center">
                    <h3>{supplier.name}</h3>
                    {supplier.productCategories.map((id) => (
                        <span key={id} className="bg-black/90 text-white text-sm px-2 py-1 rounded-full">
                            {categories.find(c => c.id === id)?.name ?? id}
                        </span>
                    ))}
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <ContactButton supplierId={supplier.id} />
                    <button onClick={handleClickFavorite} className="border-muted border-1 p-2 rounded-full w-full h-max h-full items-center justify-center cursor-pointer group/heart transition-color duration-300 hover:bg-border/50">
                        <Heart size={18} className={`transition-transform duration-150 ${isAnimating ? "scale-125" : "scale-100"} ${!isFavorite ? "text-primary group-hover/heart:fill-primary" : "text-primary fill-primary"}`} />
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:flex-row lg:gap-6">
                <div className="flex flex-row gap-1 items-center">
                    <MapPin size={14}></MapPin>
                    <p className="text-muted-foreground">{supplier.city}</p>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <div className="flex flex-row">
                        <Euro size={12}></Euro>
                        {supplier.priceRange !== "ECONOMIC" && <Euro size={12}></Euro>}
                        {supplier.priceRange === "PREMIUM" && <Euro size={12}></Euro>}
                    </div>
                    <p className="text-muted-foreground">{priceRangeLabel[supplier.priceRange]}</p>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <p>{supplier.averageRating}</p>
                    <p className="text-muted-foreground text-xs">{`(${supplier.reviewsCount} avis)`}</p>
                </div>
            </div>
            <div className="flex flex-row gap-2">
                {supplier.labels.map((id) => (
                    <Badge key={id}>{allLabels.find(l => l.id === id)?.name ?? id}</Badge>
                ))}
            </div>
        </div>
    )
}