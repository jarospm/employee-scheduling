# Employee Scheduling API — Backend

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the database

```bash
cp .env-example .env
docker compose up -d
```

This starts PostgreSQL on port 5433 and pgAdmin on port 8080.

- **pgAdmin UI** — http://localhost:8080 (login: `admin@admin.com` / `admin`)
- **PostgreSQL** — `localhost:5433` (user: `root`, password: `root`, db: `employee_scheduling`)

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env-example .env
```

The `.env` file is gitignored — never commit it.

#### Variables

- **PORT** — port the Express server runs on (default `3000`)
- **DATABASE_URL** — PostgreSQL connection string that Prisma uses to connect to the database. Format: `postgresql://USER:PASSWORD@HOST:PORT/DB_NAME`
- **JWT_SECRET** — secret key used to sign and verify JWT auth tokens. Use any random string. Keep it private — anyone with this value can forge tokens.

### 4. Run the dev server

```bash
npm run dev
```

Starts the server with `tsx watch` — auto-restarts on file changes.

## Scripts

- `npm run dev` — start dev server with hot reload
- `npm run build` — compile TypeScript to `dist/`
- `npm run start` — run compiled output (production)
- `npm run lint` — run ESLint
- `npm run lint:fix` — auto-fix lint issues

## Project Structure

```
src/
├── index.ts              # Entry point — Express app, mounts routes
├── schema.ts             # Zod schemas — single source of truth for input validation
├── routes/               # Route definitions — HTTP method + path + middleware chain
│   ├── auth.ts
│   ├── employees.ts
│   ├── availability.ts
│   └── schedule.ts
├── controllers/          # Request handlers — parse request, call service, send response
│   ├── auth.ts
│   ├── employees.ts
│   ├── availability.ts
│   └── schedule.ts
├── services/             # Business logic — Prisma queries, data processing
│   ├── auth.ts
│   ├── employees.ts
│   ├── availability.ts
│   └── schedule.ts
└── middleware/            # Reusable middleware — runs before controllers
    ├── auth.ts           # JWT verification + role-based access
    ├── validate.ts       # Zod schema validation (generic)
    └── errorHandler.ts   # Global error handler
```

## Request Flow

Every request follows the same path through the layers:

```
Request → Route → Middleware (auth, validate) → Controller → Service → Prisma → Response
```

- **Route** — wiring only: maps a path to middleware + a controller function
- **Middleware** — cross-cutting concerns reused across routes (auth, validation, errors)
- **Controller** — HTTP layer: reads params/body, calls the service, picks the status code
- **Service** — business logic: no knowledge of HTTP, works with plain data and Prisma
- **Schema** — Zod schemas define valid input shapes, also export TypeScript types via `z.infer`
