# Le Bon Fournisseur

A B2B platform connecting restaurants and food suppliers.

https://lebonfournisseur.fr

## Stack

- Frontend: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- Backend: NestJS + TypeORM + MySQL
- Infrastructure: Docker + Nginx
- Storage: AWS S3
- CI/CD: GitHub Actions

## Getting started

Prerequisites: Docker and Docker Compose.

### Start the project

```bash
docker compose -f docker-compose.dev.yml up
```

App available at `http://localhost:8888`

### Stop the project

```bash
docker compose -f docker-compose.dev.yml down
```

## Database setup

Run migrations and seed after starting the project for the first time:

```bash
docker compose -f docker-compose.dev.yml exec backend npm run migration:run
docker compose -f docker-compose.dev.yml exec backend npm run seed
```

The seed can be run multiple times without creating duplicates.

## Tests

### Backend : unit and integration tests

```bash
cd backend
npm install
npm run test
```

### Frontend : E2E tests

```bash
cd frontend
npm install
npx playwright install
npm run test:e2e
```

E2E tests require the full stack to be running and the database to be seeded.

## Test credentials

All seeded accounts use the password: `Password123!`

Example restaurant: `hello@bouchonlyonnais.com`
Example supplier: `contact@fermebio-beaujolais.com`

See the full list in the seed output.

## Deployment

- Frontend: Vercel (continuous deployment from GitHub)
- Backend + Database: Railway (continuous deployment from GitHub)
- Files: AWS S3 (public bucket for establishment documents, private bucket for message attachments)
- Domain: lebonfournisseur.fr (IONOS)
