# Local Setup Guide

Follow these instructions to run FTax locally for development.

## Prerequisites
* Node.js (v20+)
* pnpm (v9+)
* Docker & Docker Compose
* Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/swayam45-wq/Ftax.git
   cd Ftax
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   The default values in `.env` are pre-configured to work out-of-the-box with the local Docker containers.

4. **Start Infrastructure Services**
   This spins up PostgreSQL and Redis in the background:
   ```bash
   docker compose up -d
   ```

5. **Initialize the Database**
   Since we use a local Postgres container, make sure Docker is running. To sync the database schema and generate the client:
   ```bash
   pnpm run db:migrate
   ```
   If there are no migrations, you can directly push the schema structure:
   ```bash
   pnpm exec prisma db push --schema=apps/api/prisma/schema.prisma
   ```
   *(Optional)* Run the seed script to populate initial test data:
   ```bash
   pnpm run db:seed
   ```

6. **Start the Development Servers**
   This starts both NestJS backend (port 3001) and Next.js frontend (port 3000) concurrently:
   ```bash
   pnpm run dev
   ```

## Accessing the Apps
* **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
* **Backend API Swagger Docs:** [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
* **Prisma Database Studio:** Run `pnpm run db:studio` to view the database at [http://localhost:5555](http://localhost:5555)

## Main Features Configured
1. **Residency Check (Step 1):** Substantial Presence Test (SPT) engine based on travel history.
2. **Form 8843 Auto-Filler (Step 2):** Uses client-side `pdf-lib` to pre-populate and download the official, original fillable IRS Form 8843 PDF.
3. **Tax Treaty Lookup (Step 3):** Standard student exemption rules for countries (India, China, South Korea, Germany).
4. **Tax Calculator (Step 4):** Federal 1040-NR marginal tax rates + Illinois 4.95% flat state tax with visual bracket breakdown.
5. **Auth Route Protection:** Route-guarding via Next.js Edge middleware.

