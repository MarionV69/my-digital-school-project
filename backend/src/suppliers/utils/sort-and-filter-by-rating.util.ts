import { SupplierListItemDto } from '../dto/supplier-list-item.dto';

export function sortAndFilterByRating(
  suppliers: SupplierListItemDto[],
  minRating?: number,
): SupplierListItemDto[] {
  return suppliers
    .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
    .filter((supplier) => (supplier.averageRating ?? 0) >= (minRating ?? 0));
}
