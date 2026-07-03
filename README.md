# FTax — F-1 International Student Tax Assistant

> A modern, secure web application that helps F-1 international students at UIC (University of Illinois at Chicago) determine their tax residency status, identify required forms, calculate basic tax information, and generate a filing-ready package.

[![CI](https://github.com/swayam45-wq/Ftax/actions/workflows/ci.yml/badge.svg)](https://github.com/swayam45-wq/Ftax/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ⚠️ Disclaimer

FTax is **not** an IRS e-file service, tax advice provider, or licensed tax professional. It helps you understand your situation and prepare documents. Always consult a qualified tax professional for advice specific to your situation.

---

## ✨ Features

- **Residency Determination** — Automatically calculates your tax residency status (Resident Alien vs. Nonresident Alien) using the Substantial Presence Test and F-1 exempt years rule
- **Plain English Explanations** — Every question, form, and result explained in simple language
- **Treaty Detection** — Automatically checks if your country has a tax treaty with the U.S.
- **Form 8843 Guidance** — Step-by-step preparation for the mandatory "Statement for Exempt Individuals"
- **1040-NR Summary** — Nonresident tax return calculation and checklist
- **UIC-Specific** — Pre-configured for University of Illinois Chicago students
- **Rule-Driven** — Tax rules live in JSON files, updated yearly without code changes
- **Secure** — SSN/ITIN encrypted at rest, JWT auth, audit logging

---

## 🏗️ Architecture

```
Ftax/
├── apps/
│   ├── web/                    # Next.js 14 frontend (App Router)
│   └── api/                    # NestJS backend
├── packages/
│   ├── types/                  # Shared TypeScript types
│   ├── rules/                  # Tax rule JSON files (2025.json, 2026.json...)
│   └── utils/                  # Shared utilities
├── docker-compose.yml          # PostgreSQL + Redis + API + Web
├── .github/workflows/ci.yml    # GitHub Actions CI
└── README.md
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, TanStack Query |
| **Backend** | NestJS, TypeScript, Passport.js, class-validator, class-transformer |
| **Database** | PostgreSQL 16, Prisma ORM |
| **Cache** | Redis 7 |
| **Auth** | JWT (access + refresh tokens), bcrypt, httpOnly cookies |
| **Email** | Nodemailer (Mailtrap for dev, SMTP for prod) |
| **PDF** | pdf-lib (fills official IRS PDF forms) |
| **Containers** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Package Manager** | pnpm (workspaces) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker Desktop

### 1. Clone and install

```bash
git clone https://github.com/swayam45-wq/Ftax.git
cd Ftax
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start with Docker

```bash
# Start PostgreSQL + Redis
docker-compose up postgres redis -d

# Run database migrations
pnpm db:migrate

# Seed initial data
pnpm db:seed

# Start development servers
pnpm dev
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs (Swagger)

---

## 🗃️ Database Schema

```
Users ──────────── Profiles
  │                    │
  ├── RefreshTokens    ├── TravelHistory
  ├── EmailVerifications├── ResidencyHistory
  └── AuditLogs        └── IncomeSources
                   TaxTreaties
                   TaxReturns
                   GeneratedForms
```

---

## 🔧 Tax Rule Engine

Tax rules live in `packages/rules/` as versioned JSON files:

```
packages/rules/
├── 2025.json    ← current year
├── 2026.json    ← next year (when ready)
└── README.md    ← how to update rules
```

To update rules for a new tax year:
1. Copy `2025.json` → `2026.json`
2. Update constants (brackets, deadlines, rates)
3. Add/modify rules as needed
4. **No code changes required**

---

## 📋 User Flow

```
Landing Page
    ↓
Register → Email Verification
    ↓
Login
    ↓
Dashboard
    ↓
Fill Profile (Personal → Visa → UIC Info → Travel History)
    ↓
Residency Check → Result + Explanation
    ↓
[Phase 2] Income Entry → Treaty Check → Tax Calculation
    ↓
[Phase 2] Generate Forms → Download Package
```

---

## 🛡️ Security

- Passwords hashed with bcrypt (12 rounds)
- SSN/ITIN encrypted at rest (AES-256-GCM)
- JWT access tokens (15 min) + rotating refresh tokens (7 days, httpOnly cookie)
- Rate limiting on all auth endpoints
- Helmet.js security headers
- Input validation via class-validator + Zod
- Audit logs for all sensitive operations

---

## 📁 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, get tokens |
| POST | `/auth/refresh` | Rotate refresh token |
| POST | `/auth/logout` | Invalidate tokens |
| POST | `/auth/verify-email` | Verify email address |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password` | Reset password |
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile |
| POST | `/profile/travel` | Add travel entry |
| GET | `/profile/travel` | List travel history |
| DELETE | `/profile/travel/:id` | Remove travel entry |
| POST | `/tax/residency-check` | Run residency engine |

Full Swagger docs at `/api/docs` when running locally.

---

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:cov
```

---

## 🌱 Phase Roadmap

| Phase | Status | Features |
|-------|--------|---------|
| **Phase 1** | 🚧 In Progress | Auth, Profile, Residency Engine, Core UI |
| **Phase 2** | 📋 Planned | Income module, Tax Calculator, Treaty checker |
| **Phase 3** | 📋 Planned | Form 8843 PDF, 1040-NR summary, Download package |
| **Phase 4** | 💡 Future | OCR uploads, Email reminders, State tax (IL) |

---

## 👨‍💻 Development

```bash
# Add a package to the API
pnpm --filter @ftax/api add <package>

# Add a package to the web
pnpm --filter @ftax/web add <package>

# Run Prisma Studio
pnpm db:studio

# Generate Prisma client
pnpm --filter @ftax/api exec prisma generate

# Format code
pnpm format
```

---

## 📜 License

MIT © 2025 FTax