import type { supplierDetails } from "@/types/supplierDetails.type"

type CoverPhotoProps = {
    supplier: supplierDetails
}

export default function CoverPhoto({supplier}: CoverPhotoProps) {
    return(
        <div className="w-full h-48 lg:h-96 relative">
          <img
            src={supplier.coverPhotoUrl}
            alt={supplier.name}
            className="w-full h-full object-cover"
          />
        </div>
    )
}