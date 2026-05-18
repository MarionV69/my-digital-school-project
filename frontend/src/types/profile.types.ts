import type { Catalog } from "./supplierDetails.type";

// Types pour les établissements
export const initialValues = {
    legalName: '',
    tradeName: '',
    siret: '',
    vatNumber: '',
    phone: '',
    website: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
    description: '',
    facebook: '',
    instagram: '',
};

export type ProfileValuesType = typeof initialValues;

export const initialErrors = {
    legalName: null as string | null,
    tradeName: null as string | null,
    siret: null as string | null,
    vatNumber: null as string | null,
    phone: null as string | null,
    website: null as string | null,
    address: null as string | null,
    postalCode: null as string | null,
    city: null as string | null,
    country: null as string | null,
    description: null as string | null,
    facebook: null as string | null,
    instagram: null as string | null,
};

export type FieldErrorsType = typeof initialErrors;

// Types pour les fournisseurs
export const initialSuppliersValues = {
    productCategories: [] as number[],
    labels: [] as number[],
    supplierType: '',
    priceRange: '',
    isPremium: false,
    deliveryRadiusKm: null as number | null,
    deliveryInformation: '',
    minimumOrderAmount: null as number | null,
    isVisible: false,
    logoUrl: null as string | null,
    coverPhotoUrl: null as string | null,
    galleryPhotos: [] as string[],
    catalogs: [] as Catalog[],
};

export type ProfilSupplierValuesType = typeof initialSuppliersValues;

export const initialSuppliersErrors = {
    productCategories: null as string | null,
    labels: null as string | null,
    supplierType: null as string | null,
    priceRange: null as string | null,
    isPremium: null as boolean | null,
    deliveryRadiusKm: null as number | null,
    deliveryInformation: null as string | null,
    minimumOrderAmount: null as number | null,
    isVisible: null as boolean | null,
};

export type SupplierFieldErrorsType = typeof initialSuppliersErrors;