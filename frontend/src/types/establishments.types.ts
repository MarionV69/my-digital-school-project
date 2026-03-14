export const EstablishmentType = {
  RESTAURANT: "RESTAURANT",
  SUPPLIER: "SUPPLIER",
} as const;

export type EstablishmentType =
  (typeof EstablishmentType)[keyof typeof EstablishmentType];
