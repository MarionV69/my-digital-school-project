import type { supplierType } from "@/types/supplier"
import { BadgeCheck, Heart, MapPin, Star } from "lucide-react"
import { Badge } from "../ui/badge"
import { Link } from "react-router-dom"
import { useState } from "react"

type SupplierCardProps = {
    supplier: supplierType,
    isFavorite: boolean,
    onFavoriteToggle: () => void;
}

export default function SupplierCard({supplier, isFavorite, onFavoriteToggle}: SupplierCardProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
        onFavoriteToggle();
    }

    return (
        <Link to={`/suppliers/${supplier.id}`}>
            <div className="flex flex-col border-1 border-card/80 rounded-lg cursor-pointer group transition-colors duration-1000 hover:border-card h-full hover:bg-muted/40">
                <div className="h-48 overflow-hidden rounded-t-lg relative">
                    <button 
                        className="absolute top-2 right-2 bg-white/90 p-2 rounded-full z-10 group/heart"
                        onClick={handleClick}
                        >
                        <Heart 
                            size={18} 
                            className={`transition-transform duration-150 ${isAnimating ? "scale-125" : "scale-100"} ${!isFavorite ? "text-primary group-hover/heart:fill-primary" : "text-primary fill-primary"}`}
                             />
                    </button>
                    <img 
                        src={supplier.coverPhotoUrl}
                        alt={supplier.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <span className="absolute bottom-2 left-2 bg-black/90 text-white text-sm px-2 py-1 rounded-full z-10">
                        {supplier.productCategories[0]}
                    </span>
                </div>
                <div className="flex flex-col p-6 gap-3">
                    {supplier.isPremium && (
                        <BadgeCheck size={16} className="text-primary" />
                    )}
                    <div className="flex flex-row items-baseline gap-4">
                        <h4 className="w-full">{supplier.name}</h4>
                        <div className="flex flex-row gap-1 items-center">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            <p>{supplier.averageRating}</p>
                            <p className="text-muted-foreground text-xs">({supplier.reviewsCount})</p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-0.5 items-center">
                        <MapPin size={14}></MapPin>
                        <p className="text-muted-foreground">{supplier.city}</p>
                    </div>
                    <div className="flex flex-wrap gap-0.5 items-center">
                        {supplier.labels.map((label) => (
                            <Badge key={supplier.id}>{label}</Badge>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    )
}