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
   Push the Prisma schema to the Postgres database and generate the client:
   ```bash
   pnpm run db:migrate
   ```
   *(Optional)* Run the seed script to populate test data:
   ```bash
   pnpm run db:seed
   ```

6. **Start the Development Servers**
   This command starts both the NestJS API and Next.js Frontend concurrently:
   ```bash
   pnpm run dev
   ```

## Accessing the Apps
* **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
* **Backend API Swagger Docs:** [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
* **Prisma Database Studio:** Run `pnpm run db:studio` to view the DB at [http://localhost:5555](http://localhost:5555)

## Mailtrap (Local Email Testing)
In development, emails (like verification and password reset) are routed through Nodemailer. By default, they log to the console. To capture them in a GUI, sign up for a free [Mailtrap](https://mailtrap.io/) account and update the `MAIL_USER` and `MAIL_PASS` variables in your `.env` file.
