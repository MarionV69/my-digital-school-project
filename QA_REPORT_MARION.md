# QA_REPORT.md

## Présentation du projet

Le Bon Fournisseur est une plateforme B2B de mise en relation entre restaurateurs et fournisseurs alimentaires, développée en binôme avec Lisa Sauvinet dans le cadre du module MyDigitalProject de MyDigitalSchool.

Ce rapport QA porte uniquement sur le module conversations que j'ai développé dans le projet (tests unitaires et d'integration) et sur un parcours utilisateur intégrant notamment la création d'une conversation et l'envoi d'un message (test E2E).

Stack :

- Frontend: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- Backend: NestJS + TypeORM + MySQL
- Infrastructure: Docker + Nginx
- Storage: AWS S3
- CI/CD: GitHub Actions
- Tests: Jest + Supertest (backend), Playwright (frontend)

## Fonctionnalités développées

- Création d'une conversation entre un restaurant et un fournisseur
- Envoi de messages et de pièces jointes
- Consultation des conversations et des messages
- Marquage des messages comme lus
- Comptage des messages non lus
- Accès sécurisé aux pièces jointes via URLs signées S3

## Règles métier principales

- Seul un restaurant peut initier une conversation
- Une seule conversation peut exister entre deux établissements donnés
- Seuls les participants peuvent accéder aux échanges
- Un message doit contenir au moins un texte ou une pièce jointe

## Démarche TDD

Le code existait avant la réalisation des tests pour ce TP. Les cycles ci-dessous sont reconstruits sur la méthode `createConversation` de ConversationsService.

**Cycle 1**
Comportement attendu : un fournisseur ne peut pas créer une conversation.
Test écrit : `should throw ForbiddenException when called by a SUPPLIER`
Résultat initial : échec
Code ajouté : vérification du type d'établissement en début de méthode, exception Forbidden si supplier
Résultat final : succès

**Cycle 2**
Comportement attendu : si le fournisseur ciblé n'existe pas, une erreur est levée.
Test écrit : `should throw NotFoundException when supplier does not exist`
Résultat initial : échec
Code ajouté : recherche du fournisseur en base, exception NotFound si absent
Résultat final : succès

**Cycle 3**
Comportement attendu : si une conversation existe déjà, elle est retournée sans en créer une nouvelle.
Test écrit : `should return existing conversation without calling save`
Résultat initial : échec
Code ajouté : recherche d'une conversation existante, retour anticipé si trouvée
Résultat final : succès

**Cycle 4**
Comportement attendu : si aucune conversation n'existe, une nouvelle est créée et retournée.
Test écrit : `should create and return a new conversation when none exists`
Résultat initial : échec
Code ajouté : création et sauvegarde de la conversation
Résultat final : succès

## Risques qualité identifiés

- Une régression sur le contrôle des participants passerait inaperçue sans test
- Une pièce jointe privée pourrait être accessible si la génération d'URL signée est mal implémentée
- Le marquage des messages comme lus pourrait échouer silencieusement en cas de mauvaise détermination de l'expéditeur

## Stratégie de tests

Les tests unitaires couvrent la logique métier du service en mockant toutes les dépendances (service isolé).

Les tests d'intégration vérifient que le controller, le service, la validation des DTOs et les guards fonctionnent ensemble via Supertest. Les repositories restent mockés.

Le test E2E couvre un parcours utilisateur complet : connexion, navigation vers le détail d'un fournisseur, création d'une conversation et envoi d'un message.

## Tests unitaires réalisés

Fichier : `backend/src/conversations/conversations.service.spec.ts` : 31 tests

Méthodes couvertes : `createConversation`, `sendMessage`, `sendAttachment`, `getConversationMessages`, `getTotalUnreadCount`, `getConversations`, `getAttachmentSignedUrl`.

Cas couverts : cas nominaux, cas limites (liste vide, conversation existante, zéro non lus), cas d'erreur (403, 404), vérification que les données sensibles ne sont pas exposées (siret, vatNumber).

Commande : `npm run test` depuis `backend/`

## Tests d'intégration réalisés

Fichier : `backend/src/conversations/conversations.integration.spec.ts` : 21 tests

Routes couvertes : toutes les routes du module conversations (POST, GET).

Cas couverts : cas nominaux avec vérification de la structure JSON, cas d'erreur (400, 403, 404, 422), validation des DTOs.

Commande : `npm run test` depuis `backend/`

## Test E2E réalisé

Outil : Playwright
Fichier : `frontend/e2e/conversation-journey.spec.ts` : 1 test

Parcours : page login => remplissage et envoi formulaire => page liste des fournisseurs affichée => clic sur une card => page détail du fournisseur affiché => clic sur bouton "Contacter le fournisseur" => page de la conversation affichée => écriture message et clic sur bouton envoi => message envoyé et bulle du message affichée.

Le message contient un timestamp pour éviter les faux positifs liés à de précédents tests.

Commande : `npm run test:e2e` depuis `frontend/`

## Pipeline CI/CD

Fichier : `.github/workflows/ci.yml`

Déclenchement : push et pull request sur `main`, `develop`, `feature/**`, `release/**`, `hotfix/**`.

Étapes : installation des dépendances, lint, tests Jest, build (frontend et backend).

Si un test échoue, la pipeline passe en rouge et le merge peut être bloqué.

Le test E2E n'est pas dans la pipeline car il nécessite une stack complète avec base de données seedée.

## Utilisation de l'IA générative

Outil : Claude (Anthropic).

Prompts principaux : écriture des tests avec pattern AAA, extraction des données de test en fixtures et constantes partagées, débogage des erreurs TypeScript.

Ce qui vient de mes décisions : l'idée des fixtures et mocks séparés, l'application du AAA partout, l'ordre des tests, le choix des cas à couvrir.

Ce qui a été gardé : structure des mocks TypeORM, chaînage `mockReturnThis()` pour le queryBuilder.

Ce qui a été modifié : nommage des variables, reformulation de certains tests.

Limite : Claude ne peut pas exécuter le code, chaque suggestion a été testée et ajustée manuellement.

## Limites actuelles

- Les repositories sont mockés : le SQL généré n'est pas vérifié
- Le test E2E crée un message en base à chaque run
- Le test E2E n'est pas dans la pipeline CI/CD
- Seul le module conversations est couvert

## Améliorations possibles

- Base de données de test dédiée avec reset automatique
- Inclure le test E2E dans la CI/CD
- Étendre la couverture aux autres modules
