import type { supplierDetails } from "@/types/supplierDetails.type"
import { Heart, MapPin, Star } from "lucide-react"
import { Badge } from "../ui/badge"
import { useState } from "react"
import ContactButton from "../conversations/ContactButton"

type SupplierHeaderProps = {
    supplier: supplierDetails, 
    isFavorite: boolean,
    onFavoriteToggle: () => void,
}

export default function SupplierHeader({supplier, isFavorite, onFavoriteToggle}: SupplierHeaderProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    function handleClickFavorite(e: React.MouseEvent) {
        e.preventDefault();
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
        onFavoriteToggle();
    }

    return(
        <div className="gap-2 flex flex-col">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-6 items-center">
                    <h3>{supplier.name}</h3>
                    {supplier.productCategories.map((c) => (
                        <span className="bg-black/90 text-white text-sm px-2 py-1 rounded-full">
                        {c}
                        </span>
                    ))}
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <ContactButton supplierId={supplier.id} />
                    <button onClick={handleClickFavorite} className="border-muted border-1 p-2 rounded-full w-full h-max items-center justify-center group/heart">
                        <Heart size={18} className={`transition-transform duration-150 ${isAnimating ? "scale-125" : "scale-100"} ${!isFavorite ? "text-primary group-hover/heart:fill-primary" : "text-primary fill-primary"}`} />
                    </button>
                </div>
            </div>
            <div className="flex flex-row gap-6">
                <div className="flex flex-row gap-1 items-center">
                    <MapPin size={14}></MapPin>
                    <p className="text-muted-foreground">{supplier.city}</p>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <MapPin size={14}></MapPin>
                    <p className="text-muted-foreground">{supplier.priceRange}</p>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <p>{supplier.averageRating}</p>
                    <p className="text-muted-foreground text-xs">{`(${supplier.reviewsCount} avis)`}</p>
                </div>
            </div>
            <div className="flex flex-rox gap-2">
                {supplier.labels.map((l) => (
                    <Badge>{l}</Badge>
                ))}
            </div>
            
        </div>
    )
}



