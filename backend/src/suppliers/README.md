# Module suppliers

## À quoi sert ce module

Dans Le Bon Fournisseur, il y a deux types d'utilisateurs : les restaurateurs et les fournisseurs. En base, les deux sont stockés dans la table `Establishment`, avec un champ `type`. Si `type = SUPPLIER`, une ligne est aussi créée dans `SupplierAttributes`.

Le module `suppliers` gère tout ce qui concerne ces `SupplierAttributes` : ajout, modification, recherche, suppression, etc.

## Ce qui concerne le mini-projet QA

Ce mini-projet ne porte que sur une partie du module :

- `findAll()` dans `suppliers.service.ts` (la recherche avec filtres)
- `sortAndFilterByRating()` dans `utils/sort-and-filter-by-rating.util.ts` (tri + filtre par note)

Le reste du module (`findOne`, `update`, `remove`, etc.) existe mais n'est pas testé ici.

Pour le détail de la démarche (TDD, stratégie de tests, limites...), voir [`QA_REPORT.md`](../../../QA_REPORT.md).

## Lancer les tests

Depuis le dossier `backend/` :

```bash
# Tests unitaires (fonction sortAndFilterByRating)
npm run test -- sort-and-filter-by-rating

# Tests d'intégration (route GET /suppliers)
npm run test -- suppliers.integration

# Tous les tests du module suppliers
npm run test -- suppliers
```

Depuis le dossier `frontend/` :

```bash
# Test E2E (recherche + filtrage)
npx playwright test
```

Pour le test E2E, il faut que le frontend tourne sur `http://localhost:5173`, et qu'il y ait au moins un fournisseur à Lyon avec la catégorie "Poissons & Produits de la mer" en base.