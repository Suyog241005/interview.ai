# Interview.AI Documentation Index

Welcome to the comprehensive architecture, API, database, and context documentation for **Interview.AI** — a dual-interface, AI-driven mock interview and candidate assessment platform.

---

## 📚 Documentation Directory

| Document | Description | Target Audience |
| :--- | :--- | :--- |
| [Architecture Overview](./architecture.md) | High-level system architecture, system topology, component interactions, network boundaries, and technology matrix. | Engineers, Architects |
| [Workflows & User Journeys](./workflows.md) | End-to-end user journeys: Candidate Practice, Recruiter Hiring Campaigns, and AI Diagnostic Loops with sequence diagrams. | Product, Full-Stack Engineers |
| [Frontend Architecture](./frontend-architecture.md) | Next.js 15 App Router, Candidate Cockpit, Recruiter Suite, Gateway, UI design system, and Web Speech API. | Frontend Engineers |
| [Backend Architecture](./backend-architecture.md) | Express 5 on Bun, tRPC v11, Better Auth, Multer middleware, PostgreSQL + Prisma ORM, and Google Gemini AI pipeline. | Backend Engineers |
| [API Reference & Procedures](./api-reference.md) | Exhaustive catalog of all tRPC v11 routers, procedures, inputs/outputs, authorization middleware, and error codes. | Full-Stack Engineers |
| [AI Engineering & Prompts](./ai-engineering.md) | Google Gemini 2.5 Flash architecture, exact prompt templates, multimodal parsing, and diagnostic scoring rubrics. | AI / Full-Stack Engineers |
| [Database Schema Reference](./database-schema.md) | Exhaustive specification of all 18 PostgreSQL Prisma models, enums, cascade deletes, indexes, and ERD. | Backend Engineers, DBAs |
| [Environment Variables Guide](./environment-variables.md) | Complete dictionary of every environment variable across local development and production deployments. | DevOps, Full-Stack Engineers |
| [Packages & Workspaces](./packages.md) | Monorepo structure, `@interview.ai/*` internal packages, dependency graph, and Bun workspace script orchestration. | All Developers |
| [Implementation Status & Roadmap](./roadmap-and-gaps.md) | Matrix of what is 100% built vs. ready backend features awaiting recruiter views, and the development roadmap. | Product, All Developers |

---

## 🎯 Executive Summary

**Interview.AI** bridges the gap between **candidate interview preparation** and **enterprise recruiter talent screening**:

1. **Candidate Web (`apps/candidate-web` @ `:5173`)**: Candidates upload resumes (PDF) which Cloudinary stores and Google Gemini analyzes multimodally to extract skills, experience, and projects. Candidates configure practice sessions, interact in real-time via voice speech recognition and audio synthesis with a simulated AI interviewer, and receive scored diagnostic performance reports.
2. **Recruiter Web (`apps/recruiter-web` @ `:5174`)**: Hiring teams manage corporate profiles, publish job openings with tailored interview configurations, auto-generate question sets using Gemini, and issue secure assessment invitation links to applicants.
3. **Gateway (`apps/gateway` @ `:3000`)**: Unified landing and routing portal connecting visitors to either Candidate Practice or the Recruiter Enterprise Suite.
4. **Common Backend (`apps/server` @ `:3001` / `:8000`)**: A centralized Express server powered by Bun runtime, offering type-safe tRPC v11 endpoints, Better Auth multi-role authentication (supporting Google/GitHub OAuth and credentials), PostgreSQL database access via Prisma ORM on Neon, and Google Gemini 2.5 Flash AI evaluation services.
5. **Shared Packages (`packages/*`)**: Reusable workspace packages for database schema, API routers and client, authentication, shared TypeScript types/Zod schemas, and a cohesive Radix/Tailwind UI component library.
