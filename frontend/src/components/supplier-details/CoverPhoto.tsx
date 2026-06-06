import type { supplierDetails } from "@/types/supplierDetails.type"

type CoverPhotoProps = {
    supplier: supplierDetails
}

export default function CoverPhoto({supplier}: CoverPhotoProps) {
    return(
        <div className="relative w-full h-48 lg:h-96">
            <img
                src={supplier.coverPhotoUrl}
                alt={supplier.name}
                className="w-full h-full object-cover"
            />
            {supplier.logoUrl && (
                <div className="absolute -bottom-8 left-6 lg:left-24 p-4 rounded-lg border-white shadow-md bg-white">
                    <img
                        src={supplier.logoUrl}
                        alt={`Logo ${supplier.name}`}
                        className="w-auto h-20 lg:h-24 object-cover"
                    />
                </div>
            )}
        </div>
    )
}