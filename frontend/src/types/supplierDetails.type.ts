export interface Catalog {
    id: number;
    originalFilename: string;
    mimeType: string;
    size: number;
    url: string;
}

interface Review {
    reviewerRestaurant: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface supplierDetails {
    id: number;
    name: string;
    city: string;
    postalCode: string;
    priceRange: string;
    isPremium: boolean;
    labels: number[];
    productCategories: number[];
    logoUrl?: string;
    coverPhotoUrl?: string;
    reviewsCount: number;
    averageRating: number;
    description?: string;
    deliveryRadiusKm?: number;
    deliveryInformation?: string;
    minimumOrderAmount?: number;
    website?: string;
    instagram?: string;
    facebook?: string;
    catalogs: Catalog[];
    galleryPhotos: string[];
    reviews: Review[];
}

