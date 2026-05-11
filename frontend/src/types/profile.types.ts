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
    legalName: null,
    tradeName: null,
    siret: null,
    vatNumber: null,
    phone: null,
    website: null,
    address: null,
    postalCode: null,
    city: null,
    country: null,
    description: null,
    facebook: null,
    instagram: null,
};

export type FieldErrorsType = typeof initialErrors;

// Types pour les fournisseurs
export const initialSuppliersValues = {
    productCategories: [] as number[],
    labels: [] as number[],
    supplierType: '',
    priceRange: '',
    isPremium: false,
    deliveryRadiusKm: null,
    deliveryInformation: '',
    minimumOrderAmount: null,
    isVisible: false,
};

export type ProfilSupplierValuesType = typeof initialSuppliersValues;

export const initialSuppliersErrors = {
    productCategories: null,
    labels: null,
    supplierType: null,
    priceRange: null,
    isPremium: null,
    deliveryRadiusKm: null,
    deliveryInformation: null,
    minimumOrderAmount: null,
    isVisible: null,
};

export type SupplierFieldErrorsType = typeof initialSuppliersErrors;