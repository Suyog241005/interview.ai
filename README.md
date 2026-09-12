# Interview.AI

> **The Dual-Interface AI Mock Interview & Candidate Assessment Platform**

**Interview.AI** is a TypeScript monorepo combining self-serve speech-driven AI interview practice for candidates with automated campaign scheduling and diagnostic candidate screening for tech recruiters — backed by a unified Express + Bun server, tRPC v11, PostgreSQL, Better Auth, and Google Gemini 2.5 Flash.

---

## 🧭 System Topology

```
interview.ai/
├── apps/
│   ├── gateway/          # Portal router & product landing page (Port 3000)
│   ├── candidate-web/    # Candidate practice cockpit & reports (Port 5173)
│   ├── recruiter-web/    # Recruiter campaigns & evaluation cockpit (Port 5174)
│   └── server/           # Unified API server: tRPC, Better Auth, Gemini (Port 8000)
├── packages/
│   ├── api/              # tRPC v11 routers, AI services, and tRPC client
│   ├── better-auth/      # Better Auth setup, plugins, and Prisma session adapter
│   ├── db/               # PostgreSQL schema & Prisma ORM v7 client
│   ├── types/            # Shared TypeScript domain types and Zod schemas
│   └── ui/               # Shared Radix UI + Tailwind CSS v4 design system
├── docs/                 # In-depth architectural & context documentation
└── DESIGN.md             # Vercel-inspired design language and tokens specification
```

---

## ⚡ Port Allocations

| App / Service | Path | Port | Description |
| :--- | :--- | :--- | :--- |
| **Gateway** | `apps/gateway` | `3000` | Landing and routing portal |
| **Candidate Web** | `apps/candidate-web` | `5173` | AI Mock Interview Cockpit & Diagnostic Reports |
| **Recruiter Web** | `apps/recruiter-web` | `5174` | Job Campaigns & Candidate Evaluation Suite |
| **Backend Server** | `apps/server` | `8000` | Express 5 + tRPC v11 + Better Auth + Gemini AI |

---

## 🚀 Key Features

### For Candidates (`apps/candidate-web`)
- 📄 **Multimodal Resume Parsing**: Upload PDF resumes; Gemini 2.5 Flash extracts skills, projects, and work history.
- 🎯 **5-Stage Custom Curriculum**: Tailored interview questions progressing from Introduction to System Design & Behavioral judgment.
- 🎙️ **Live Voice Cockpit**: Real-time speech-to-text recognition, text-to-speech voice playback, synchronized video avatar, and radial countdown timers.
- 📊 **Diagnostic Performance Reports**: Instant quantitative scoring (Overall, Communication, Correctness, Confidence) with bulleted strengths, weaknesses, and actionable recommendations.

### For Recruiters & Companies (`apps/recruiter-web`)
- 🏢 **Company & Team Workspace**: Set up corporate profile and invite team recruiters.
- 📋 **Job Opening Campaigns**: Create positions, define experience bounds, and set hiring statuses.
- ⚙️ **AI Interview Configurator**: Auto-generate targeted interview questions from job descriptions using Gemini.
- ✉️ **Candidate Invitations**: Issue secure tokenized invite links with expiration dates.
- 📈 **Candidate Review Cockpit**: Inspect candidate speech transcripts, response audio metrics, and AI hiring recommendations.

---

## 📖 In-Depth Documentation

For full details, consult the modular documentation in the [`docs/`](./docs) directory:

- 📐 [**Architecture Overview**](./docs/architecture.md) — System topology, communication channels, and security boundaries.
- 🔄 [**Workflows & User Journeys**](./docs/workflows.md) — Step-by-step Candidate and Recruiter sequences with Mermaid diagrams.
- 🖥️ [**Frontend Architecture**](./docs/frontend-architecture.md) — Next.js 15 App Router, UI design system, and Web Speech API.
- ⚙️ [**Backend Architecture**](./docs/backend-architecture.md) — Express 5 on Bun, tRPC v11, Better Auth, and Gemini AI services.
- 📋 [**API Reference & Procedures**](./docs/api-reference.md) — Complete catalog of all tRPC procedures, inputs, outputs, and middleware.
- 🧠 [**AI Engineering & Prompts**](./docs/ai-engineering.md) — Google Gemini 2.5 Flash prompts, multimodal schemas, and evaluation rubrics.
- 🗄️ [**Database Schema Reference**](./docs/database-schema.md) — Exhaustive specification of all 18 PostgreSQL Prisma models and enums.
- 🔑 [**Environment Variables Guide**](./docs/environment-variables.md) — Dictionary of all development and production environment variables.
- 📦 [**Packages & Workspaces**](./docs/packages.md) — Monorepo layout, dependency graphs, and script orchestration.
- 🚦 [**Implementation Status & Roadmap**](./docs/roadmap-and-gaps.md) — Operational status matrix, ready backend endpoints, and upcoming phases.
- 🎨 [**Design System Specification**](./DESIGN.md) — Complete tokens, typography (Geist), colors, and component styles.

---

## 🛠️ Quick Start

### Prerequisites
- [Bun](https://bun.sh) (v1.1 or later)
- PostgreSQL Database (local or hosted, e.g., Supabase, Neon)
- Google Gemini API Key

### 1. Install Dependencies
```bash
bun install
```

### 2. Configure Environment Variables
Copy `.env.example` (or configure `.env` in `apps/server`, `apps/candidate-web`, `apps/recruiter-web`, `packages/db`):
```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/interview_ai?schema=public"

# AI Provider
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# Better Auth Secret & Base URLs
BETTER_AUTH_SECRET="your-secure-random-secret"
BETTER_AUTH_URL="http://localhost:3001"
CLIENT_URL="http://localhost:5173"
```

### 3. Generate Prisma Client & Migrate Database
```bash
cd packages/db
bunx prisma generate
bunx prisma db push
```

### 4. Start Development Servers
```bash
# Run all workspaces concurrently
bun run dev

# Or run individual services:
bun run dev:server   # Starts Express backend on :8000
bun run dev:client   # Starts Candidate Web on :5173
```
