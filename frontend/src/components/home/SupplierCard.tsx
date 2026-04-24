import type { Supplier } from "@/types/supplier"
import { Heart, MapPin, Star } from "lucide-react"
import { Badge } from "../ui/badge"

type SupplierCardProps = {
    supplier: Supplier
}

export default function SupplierCard({supplier}: SupplierCardProps) {
    return (
        <div className="flex flex-col border-1 border-card rounded-lg cursor-pointer group">
            <div className="h-48 overflow-hidden rounded-t-lg relative">
                <button className="absolute top-2 right-2 bg-white/80 p-2 rounded-full z-10 group/heart">
                    <Heart size={18} className="text-primary group-hover/heart:fill-primary" />
                </button>
                <img 
                    src={supplier.coverPhotoUrl}
                    alt={supplier.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <span className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full z-10">
                    {supplier.productCategories[0]}
                </span>
            </div>
            <div className="flex flex-col p-4 gap-2">
                <div className="flex flex-row items-baseline">
                    <h4 className="w-full">{supplier.name}</h4>
                    <div className="flex flex-row gap-0.5 items-center">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <p>{supplier.averageRating}</p>
                        <p className="text-muted-foreground text-xs">({supplier.reviewsCount})</p>
                    </div>
                </div>
                <div className="flex flex-row gap-0.5 items-center">
                    <MapPin size={14}></MapPin>
                    <p className="text-muted-foreground">{supplier.city}</p>
                </div>
                <div className="flex flex-row gap-0.5 items-center">
                    {supplier.labels.map((label) => (
                        <Badge key={supplier.id}>{label}</Badge>
                    ))}
                </div>

            </div>
        </div>
    )
}