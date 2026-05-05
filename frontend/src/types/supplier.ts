export interface Supplier {
    id: number;
    name: string;
    city: string;
    postalCode: string;
    priceRange: string;
    isPremium: boolean;
    labels: string[];
    productCategories: string[];
    logoUrl: string[];
    coverPhotoUrl: string;
    reviewsCount: number;
    averageRating: number;
}