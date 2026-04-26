export const EstablishmentType = {
  RESTAURANT: "RESTAURANT",
  SUPPLIER: "SUPPLIER",
} as const;

export type EstablishmentType =
  (typeof EstablishmentType)[keyof typeof EstablishmentType];

export type EstablishmentPreview = {
  legalName: string;
  city: string;
  website: string | null;
  avatarUrl: string | null;
};

export type CreateEstablishmentDto = {
  type: EstablishmentType;
  legalName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  siret: string;
  phone?: string;
};
