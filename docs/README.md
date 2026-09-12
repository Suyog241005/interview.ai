# Interview.AI Documentation Index

Welcome to the comprehensive architecture and context documentation for **Interview.AI** — a dual-interface, AI-driven mock interview and candidate assessment platform.

---

## 📚 Documentation Directory

| Document | Description | Target Audience |
| :--- | :--- | :--- |
| [Architecture Overview](./architecture.md) | High-level system architecture, system topology, component interactions, and data flow. | Engineers, Architects |
| [Workflows & User Journeys](./workflows.md) | End-to-end workflows: Candidate Practice, Recruiter Hiring Campaigns, and AI Diagnostic Loops. | Product, Full-Stack Engineers |
| [Frontend Architecture](./frontend-architecture.md) | Next.js 15 App Router, Candidate Cockpit, Recruiter Suite, Gateway, UI design system, and Web Speech API. | Frontend Engineers |
| [Backend Architecture](./backend-architecture.md) | Express 5 on Bun, tRPC v11, Better Auth, PostgreSQL + Prisma ORM, and Google Gemini AI pipeline. | Backend Engineers |
| [Packages & Workspaces](./packages.md) | Monorepo structure, `@interview.ai/*` internal packages, dependencies, and build orchestration. | All Developers |

---

## 🎯 Executive Summary

**Interview.AI** bridges the gap between **candidate interview preparation** and **enterprise recruiter talent screening**:

1. **Candidate Web (`apps/candidate-web` @ `:5173`)**: Candidates upload resumes (PDF) which Google Gemini analyzes to extract skills, experience, and project highlights. Candidates configure technical or HR practice interviews, interact in real-time via voice speech recognition and audio synthesis with a simulated AI interviewer, and receive scored diagnostic performance reports.
2. **Recruiter Web (`apps/recruiter-web` @ `:5174`)**: Hiring teams manage corporate profiles, publish job openings with tailored interview configurations, auto-generate question sets using Gemini, and issue secure assessment invitation links to applicants.
3. **Gateway (`apps/gateway` @ `:3000`)**: Unified landing and routing portal connecting visitors to either Candidate Practice or the Recruiter Enterprise Suite.
4. **Common Backend (`apps/server` @ `:3000` / `:8000`)**: A centralized Express server powered by Bun runtime, offering type-safe tRPC v11 endpoints, Better Auth multi-role authentication, PostgreSQL database access via Prisma ORM, and Google Gemini 2.5 Flash AI evaluation services.
5. **Shared Packages (`packages/*`)**: Reusable workspace packages for database schema, API routers and client, authentication, shared TypeScript types/Zod schemas, and a cohesive Radix/Tailwind UI component library.
