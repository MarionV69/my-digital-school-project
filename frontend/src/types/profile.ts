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
}

export type FieldErrorsType = typeof initialErrors;