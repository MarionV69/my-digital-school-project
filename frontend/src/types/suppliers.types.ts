export const SupplierType = {
  WHOLESALER: "WHOLESALER",
  RESELLER: "RESELLER",
  PRODUCER: "PRODUCER",
} as const;

export type SupplierType = (typeof SupplierType)[keyof typeof SupplierType];

export const PriceRange = {
  ECONOMIC: "ECONOMIC",
  MID_RANGE: "MID_RANGE",
  PREMIUM: "PREMIUM",
} as const;

export type PriceRange = (typeof PriceRange)[keyof typeof PriceRange];

export type CreateSupplierAttributesDto = {
  supplierType: SupplierType;
  priceRange: PriceRange;
};

export type SupplierStatsDto = {
  favoriteCount: number;
  averageRating: number;
  reviewCount: number;
};
