# AGENTS — AI Coding Agent Instructions

Purpose: Give AI coding agents the minimal, high-value context to be productive in this repository.

Quick commands
- **Dev:** `npm run dev` — runs the app with `ts-node` and `nodemon` (`src/server.ts`).
- **Build:** `npm run build` — compiles TypeScript to `dist`.
- **Start (prod):** `npm run start` — runs `dist/server.js`.
- **Database:** Uses Prisma + Postgres. Start local DB with `docker-compose up -d` and run Prisma commands:
  - `npx prisma generate`
  - `npx prisma migrate deploy` (or `npx prisma migrate dev` during development)

Project entrypoints & important files
- **Server entry:** [src/server.ts](src/server.ts)
- **Express app:** [src/app.ts](src/app.ts)
- **Prisma client:** [src/prisma.ts](src/prisma.ts)
- **Prisma schema:** [prisma/schema.prisma](prisma/schema.prisma)
- **TypeScript config:** [tsconfig.json](tsconfig.json)
- **Docker compose (Postgres):** [docker-compose.yml](docker-compose.yml)
- **Package manifest:** [package.json](package.json)

Architecture & conventions (short)
- Folder pattern: `controllers/` → `services/` → `repositories/` (controllers call services; services use repositories).
- `middlewares/` holds Express middlewares (e.g. `authMiddleware.ts`).
- Repositories use the shared Prisma client exported from `src/prisma.ts`.
- Prefer throwing `Error` from services for controller-level mapping to HTTP status codes (existing pattern).

What an agent should do first
1. Read `package.json` and `src/server.ts` to confirm run scripts and entrypoint.
2. Inspect `prisma/schema.prisma` and `docker-compose.yml` before suggesting DB-related changes.
3. Respect the controllers → services → repositories layering when adding or modifying logic.

Notes & pitfalls
- Environment variables: `.env` is gitignored; do not assume secrets in repo. Typical env keys: `DATABASE_URL`, `JWT_SECRET`, `PORT`.
- Prisma uses PostgreSQL by default; migrations are in `prisma/migrations/`.

Where to link for more details
- Package scripts and deps: [package.json](package.json)
- API handlers: [src/controllers/](src/controllers/)
- Business logic: [src/services/](src/services/)
- DB layer: [src/repositories/](src/repositories/)

If you'd like, I can also:
- Add a `.github/copilot-instructions.md` with a brief onboarding summary for pull requests.
- Create a small skill file describing common PR checks and tests to run.
