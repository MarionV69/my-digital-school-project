# QA_REPORT.md

## Présentation du projet

Ce mini-projet est basé sur mon projet de certif "Le Bon Fournisseur", fait avec Marion Vieillard. Le repo est partagé, mais ici je ne touche qu'au module `suppliers`, dont je suis seule auteure (backend + frontend).

Stack : NestJS + TypeORM + MySQL côté back, React + Tailwind côté front. Tests avec Jest et Playwright. CI/CD avec GitHub Actions.

Le module `suppliers` gère les fiches fournisseurs : recherche avec filtres, détail d'un fournisseur, création/modif/suppression.

## Fonctionnalités développées pour ce mini-projet

Je me suis concentrée sur `GET /suppliers` (la recherche avec filtres) et sur une fonction que j'ai extraite : `sortAndFilterByRating()`, qui trie les fournisseurs par note et enlève ceux sous une note minimale.

Le reste du module existe déjà mais n'est pas testé ici (par choix, pour rester sur un périmètre que je teste vraiment bien plutôt que tout faire à moitié).

## Règles métier

- Les fournisseurs sont triés par note décroissante
- Un fournisseur sous la note minimale (`minRating`) demandée est exclu
- Si pas de `minRating` donné, personne n'est exclu
- Si on envoie un filtre qui n'existe pas dans l'API, ça renvoie une erreur 400
- Tous les filtres se cumulent (ET, pas OU)

## Démarche TDD (reconstruite)

Le code de `findAll()` existait déjà avant ce mini-projet. Ce que j'ai vraiment fait : j'ai sorti la partie tri/filtre dans une fonction à part (`sortAndFilterByRating`), et j'ai écrit tous les tests.

Les 3 cycles ci-dessous sont reconstruits : ils montrent comment j'aurais procédé si j'avais fait du TDD "pur" dès le départ.

**Cycle 1 - cas nominal**
Comportement attendu : si on donne `minRating = 3`, on garde que les fournisseurs notés 3 ou plus.
Test écrit : je crée 3 faux fournisseurs (4.5, 2.0, 3.8) et je vérifie qu'avec `minRating=3` il n'en reste que 2 (4.5 et 3.8).
Échec initial : la fonction n'existait pas encore.
Code ajouté : un `.filter()` simple sur `averageRating >= (minRating ?? 0)`.
Résultat : test vert.

**Cycle 2 - cas limite : pas de minRating**
Comportement attendu : si on donne rien, personne n'est exclu, même une note à 0.
Test écrit : 3 fournisseurs (4.5, 0, 3.8), pas de `minRating` → je vérifie qu'il y a toujours 3 résultats.
Résultat : passe direct, le `?? 0` du cycle 1 gérait déjà ce cas.
Code ajouté : aucun.

**Cycle 3 - cas limite : tri avec note à 0**
Comportement attendu : le tri doit marcher même avec une note à 0, et ce fournisseur doit finir en dernier.
Test écrit : 3 fournisseurs (2.0, 0, 4.5), je vérifie l'ordre [4.5, 2.0, 0].
Résultat : passe direct aussi, le tri était déjà bon dans le code de base.
Code ajouté : aucun.

## Stratégie de tests

**Pourquoi unitaire** : `sortAndFilterByRating` est une fonction simple, sans BDD, donc facile à tester seule.

**Pourquoi intégration** : je voulais vérifier que la route, la validation et le contrôleur marchent ensemble, pas juste le service tout seul.
J'ai mocké le repository plutôt que de monter une vraie BDD de test (le sujet accepte "route + validation" comme exemple). Limite : ça ne vérifie pas que mes requêtes SQL sont correctes.

**Pourquoi ce parcours E2E** : recherche + filtre, c'est l'action principale d'un utilisateur sur le site.

**Couvert / pas couvert** :
- Couvert : tri/filtre par note, validation des filtres API, parcours recherche+filtre catégorie
- Pas couvert : le SQL généré (pas testé directement), les autres filtres (label, prix, etc.), le contenu exact des résultats après filtre E2E (je vérifie juste qu'il y a un résultat visible)

## Risques qualité

- Si la validation API foire, un mauvais filtre peut faire planter le serveur (500) au lieu de juste refuser (400)
- Si `averageRating` est `undefined` au lieu de `0` quelque part, le tri peut casser
- Si je modifie `sortAndFilterByRating` sans relancer les tests, je peux recasser le cas "pas de minRating"
- Le test E2E dépend de données précises en BDD locale, donc il peut planter chez quelqu'un d'autre juste parce que les données sont différentes

## Tests unitaires

Fichier : `backend/src/suppliers/utils/sort-and-filter-by-rating.util.spec.ts`, 4 tests :
1. Exclusion par minRating (nominal)
2. Pas de minRating = tout garder (limite)
3. Tri avec note à 0 (limite)
4. minRating plus haut que toutes les notes = tableau vide (erreur/extrême)

Commande : `npm run test -- sort-and-filter-by-rating` (depuis `backend/`)

## Tests d'intégration

Fichier : `backend/src/suppliers/suppliers.integration.spec.ts`, 2 tests :
1. Filtre inconnu dans l'URL → 400 (erreur)
2. Requête valide → 200 + tableau (nominal)

Commande : `npm run test -- suppliers.integration` (depuis `backend/`)

## Test E2E

Outil : Playwright. Fichier : `frontend/e2e/supplier-search.spec.ts`.

Parcours : recherche par ville "Lyon" + filtre catégorie → on vérifie qu'un résultat s'affiche.

J'ai utilisé des `data-testid` plutôt que des classes CSS, pour pas que le test casse si je change le design.

Détail technique : le panneau de filtres existe en double dans le DOM (version desktop + version mobile cachée), donc j'utilise `.first()` pour cibler la bonne.

Pour que le test marche, il faut que le frontend tourne sur localhost:5173 et qu'il y ait un fournisseur à Lyon avec la bonne catégorie en base.

Commande : `npx playwright test` (depuis `frontend/`)

## Pipeline CI/CD

Fichier : `.github/workflows/ci.yml`. Elle existait déjà avant ce mini-projet (faite avec Marion).

Se déclenche sur push/PR vers main, develop, feature/**, etc.

Étapes : install front → lint front → build front → install back → lint back → **test back** → build back.

L'étape "test back" lance Jest sur tout `backend/src`, donc mes nouveaux tests (unitaires + intégration) sont déjà pris en compte automatiquement, sans rien changer au fichier YAML.

Si un test échoue, le job s'arrête et la pipeline est en rouge sur GitHub.

Limite : le test E2E n'est pas dans la pipeline, parce que ça demanderait de monter une vraie BDD de test + lancer front et back dans la CI, trop lourd pour ce mini-projet. Je le lance à la main en local.

## Utilisation de l'IA

J'ai utilisé Claude pour m'aider à comprendre et structurer la démarche TDD reconstruite, écrire les tests, et débugger mes erreurs (erreur de scope JS, faute de frappe dans un sélecteur, mauvais import de supertest).

J'ai gardé : la structure des 3 cycles, le code des tests une fois que je les ai compris et testés moi-même.
J'ai changé : le choix de mocker plutôt que monter une vraie BDD pour les tests d'intégration.
J'ai refusé : créer un projet complètement séparé pour ce mini-projet, j'ai préféré rester sur le repo existant en délimitant juste mon périmètre.

Limite de l'IA : elle ne peut pas exécuter le code, donc j'ai dû tester chaque morceau moi-même, et j'ai trouvé plusieurs bugs dans ce qu'elle proposait au départ.

## Limites actuelles

- Seule la route GET /suppliers est testée, pas les autres routes du module
- Pas de vraie BDD dans les tests d'intégration (donc le SQL généré n'est pas vérifié)
- Le test E2E ne couvre qu'un seul filtre (catégorie)
- Le test E2E n'est pas dans la CI/CD
- Le test E2E dépend de données précises en local

## Améliorations possibles

- Ajouter une vraie BDD de test (genre SQLite en mémoire) pour les tests d'intégration
- Tester d'autres filtres en E2E
- Avoir un script de seed dédié aux tests E2E pour pas dépendre des données de dev
- Mettre le test E2E dans la CI/CD
- Tester aussi les autres méthodes du service (findOne, update, remove)