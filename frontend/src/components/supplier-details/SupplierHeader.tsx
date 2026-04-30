import type { supplierDetails } from "@/types/supplierDetails.type"
import { Heart, MapPin, Star } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

type SupplierHeaderProps = {
    supplier: supplierDetails
}

export default function SupplierHeader({supplier}: SupplierHeaderProps) {
    return(
        <div className="px-4 lg:px-24 pt-6 lg:pt-12 mb-24 gap-6 flex flex-col">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-6 items-center">
                    <h3>{supplier.name}</h3>
                    {supplier.productCategories.map((c) => (
                        <span className="bg-black/90 text-white text-sm px-2 py-1 rounded-full">
                        {c}
                        </span>
                    ))}
                </div>
                <div className="flex flex-row gap-1">
                    <Button>
                        Contacter
                    </Button>
                    <button className="border-1 border-border p-2 rounded-full group/heart">
                        <Heart size={18} className="text-primary group-hover/heart:fill-primary" />
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
                    <p className="text-muted-foreground text-xs">{`(${supplier.reviewsCount})`}</p>
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



