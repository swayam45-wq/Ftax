# System Architecture

FTax uses a **pnpm workspaces monorepo** to share configuration and types between the frontend and backend.

## Tech Stack
* **Frontend:** Next.js (React), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query
* **Backend:** NestJS (Node.js), TypeScript, Prisma ORM
* **Database:** PostgreSQL
* **Caching/Queues:** Redis (provisioned, to be used for background jobs if needed)
* **Infrastructure:** Docker & Docker Compose

## Monorepo Structure

```text
ftax/
├── apps/
│   ├── web/               # Next.js frontend application
│   │   ├── src/app/       # App Router pages and layouts
│   │   ├── src/components/# UI components (shadcn)
│   │   └── src/lib/       # API clients and utilities
│   │
│   └── api/               # NestJS backend application
│       ├── prisma/        # Database schema and migrations
│       └── src/           # Backend modules (auth, profile, tax)
│
├── packages/
│   ├── types/             # Shared TypeScript interfaces
│   └── rules/             # JSON tax rule configurations (e.g., 2025.json)
│
├── docker-compose.yml     # Local infrastructure (Postgres, Redis)
└── pnpm-workspace.yaml    # Monorepo configuration
```

## Security & Privacy
Because FTax handles sensitive PII (like SSN and ITIN numbers):
1. **At-Rest Encryption:** Sensitive profile fields are encrypted at rest using AES-256-GCM before being stored in PostgreSQL.
2. **JWT Authentication:** Short-lived access tokens with HTTP-only secure cookies for rotating refresh tokens.
3. **No Direct SSN Returns:** The API never returns decrypted SSNs back to the client unless explicitly required during a highly-secured PDF generation flow. 
4. **Audit Logging:** An internal audit log tracks all critical actions taken by users for compliance and debugging.
