import type { Supplier } from "./supplier";

export interface FavoritesType {
    id: number;
    ownerId: number;
    targetId: number;
    createdAt:string;
    target: Supplier;
};

export interface FavoritesSimple {
    id: number;
    targetId: number;
}