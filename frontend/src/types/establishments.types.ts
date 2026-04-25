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
