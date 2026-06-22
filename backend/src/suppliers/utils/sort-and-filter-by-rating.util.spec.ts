import { SupplierListItemDto } from '../dto/supplier-list-item.dto';
import { sortAndFilterByRating } from './sort-and-filter-by-rating.util';

describe('sortAndFilterByRating', () => {
  const makeSupplier = (
    id: number,
    averageRating: number,
  ): SupplierListItemDto =>
    ({
      id,
      averageRating,
    }) as SupplierListItemDto;

  // Cas nominal
  it('exclut les fournisseurs dont la note est inférieure au minRating', () => {
    // -- Arrange --
    const suppliers = [
      makeSupplier(1, 4.5),
      makeSupplier(2, 2.0),
      makeSupplier(3, 3.8),
    ];

    // -- Act --
    const result = sortAndFilterByRating(suppliers, 3);

    // -- Assert --
    expect(result.map((s) => s.id)).toEqual([1, 3]);
  });

  // Cas limite: minRating non défini
  it("garde tous les fournisseurs si minRating n'est pas défini", () => {
    // -- Arrange --
    const suppliers = [
      makeSupplier(1, 4.5),
      makeSupplier(2, 0),
      makeSupplier(3, 3.8),
    ];

    // -- Act --
    const result = sortAndFilterByRating(suppliers, undefined);

    // -- Assert --
    expect(result).toHaveLength(3);
  });

  // Cas limite : tri par note décroissante, y compris avec des fournisseurs n'ayant pas encore de notes
  it('trie les fournisseurs par note décroissante, en plaçant les notes à 0 en dernier', () => {
    // -- Arrange --
    const suppliers = [
      makeSupplier(1, 2.0),
      makeSupplier(2, 0),
      makeSupplier(3, 4.5),
    ];

    // -- Act --
    const result = sortAndFilterByRating(suppliers, undefined);

    // -- Assert --
    expect(result.map((s) => s.id)).toEqual([3, 1, 2]);
  });

  // Cas d'erreur: minRating supérieur à toutes les notes
  it('retourne un tableau vide si minRating est supérieur à toutes les notes', () => {
    // -- Arrange --
    const suppliers = [
      makeSupplier(1, 4.5),
      makeSupplier(2, 3.0),
      makeSupplier(3, 2.8),
    ];

    // -- Act --
    const result = sortAndFilterByRating(suppliers, 10);

    // -- Assert --
    expect(result).toEqual([]);
  });
});
