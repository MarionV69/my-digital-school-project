import type { supplierDetails } from "@/types/supplierDetails.type"

type CoverPhotoProps = {
    supplier: supplierDetails
}

export default function CoverPhoto({supplier}: CoverPhotoProps) {
    return(
        <div className="w-full h-96">
          <img
            src={supplier.coverPhotoUrl}
            alt={supplier.name}
            className="w-full h-full object-cover"
          />
        </div>
    )
}