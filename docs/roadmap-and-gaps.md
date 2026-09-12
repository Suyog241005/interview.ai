# Implementation Status, Roadmap & Next Steps

This document details the current implementation status of **Interview.AI**, highlighting what is **100% operational**, what backend capabilities are ready for frontend integration, and the exact roadmap for completion.

---

## 🚦 System Implementation Matrix

```
[████████████████████] 100% — Shared Types & Zod Schemas (@interview.ai/types)
[████████████████████] 100% — Database Schema & Prisma ORM (@interview.ai/db)
[████████████████████] 100% — Better Auth Configuration (@interview.ai/better-auth)
[████████████████████] 100% — Shared UI Component System (@interview.ai/ui)
[████████████████████] 100% — Gemini 2.5 Flash AI Service (Vercel AI SDK)
[████████████████████] 100% — Express Server & tRPC API Routers (apps/server)
[████████████████████] 100% — Candidate Web App (apps/candidate-web)
[████████████████░░░░]  80% — Gateway Portal (apps/gateway)
[████████░░░░░░░░░░░░]  40% — Recruiter Web App (apps/recruiter-web)
```

---

## ✅ 1. What is 100% Built & Operational Today

### Candidate Practice Flow (`apps/candidate-web`):
- **Landing Page & Marketing**: High-conversion hero, capability cards, interview modes showcase, FAQs, SEO metadata, and dynamic Navbar with auth and starter credits.
- **Authentication**: Better Auth Google OAuth and email/password login.
- **Resume Ingestion**: Direct client-side unsigned upload to Cloudinary (`upload_preset: "interview-ai"`), saving record to database.
- **Multimodal AI Analysis**: PDF buffer sent to Gemini 2.5 Flash via Vercel AI SDK; extracts skills, projects, experience, and role suggestions.
- **Interview Setup**: Form selecting Target Role, Experience, and Mode (`TECHNICAL` vs `HR`) with AI auto-fill.
- **Live Voice Cockpit**:
  - Speech synthesis reading questions aloud with custom pitch/rate.
  - Female AI avatar looping video.
  - Visual SVG radial countdown timer (60s / 90s / 120s based on difficulty).
  - Web Speech API continuous real-time transcription.
- **Diagnostic Evaluation Dashboard**: Overall score, sub-scores (Correctness, Communication, Confidence), strengths, weaknesses, executive summary, and question-by-question transcript review.
- **Assessment History**: Historical list of past practice sessions with scores and expandable feedback.

### Backend Infrastructure (`apps/server`, `packages/db`, `packages/api`):
- **Server**: Express 5 on Bun with Helmet, CORS whitelist, Morgan logging, and Multer disk storage (5MB PDF, 15MB audio).
- **Prisma ORM**: 18 models on Neon PostgreSQL with pooled connection.
- **Better Auth**: Database session strategy, CSRF bypass for cross-origin Next.js clients, and session extraction in tRPC context.
- **tRPC API Layer**: All procedures for candidate practice, resume analysis, company creation, job postings, candidate invitations, and AI question generation are written and tested.

---

## 🔨 2. Ready Backend Capabilities Awaiting Frontend Views

The backend router `packages/api/src/routers/company` is fully written with all recruiter capabilities. The corresponding frontend views in `apps/recruiter-web` are ready to be built:

| Backend Procedure Available | Planned Recruiter View in `apps/recruiter-web` | Purpose |
| :--- | :--- | :--- |
| `company.createCompany`, `company.getCompany` | `/company/setup` & `/settings` | Workspace onboarding and company branding |
| `company.inviteRecruiter` | `/team` | Invite team members with 12-char Crockford token |
| `company.createJob`, `company.getJob` | `/jobs` & `/jobs/new` | Job creation wizard and status management |
| `company.upsertInterviewConfig` | `/jobs/[id]/config` | Set question count, time limits, and custom prompt overrides |
| `company.generateAiQuestions` | `/jobs/[id]/questions` | Preview and curate Gemini auto-generated questions |
| `company.inviteCandidate` | `/jobs/[id]/invitations` | Issue 16-char invite links to job applicants |
| `company.getAllCompanyInterviews`, `getCompanyInterviewById` | `/interviews` & `/interviews/[id]` | Recruiter cockpit to review candidate transcripts, audio, and AI hiring recommendations |

---

## 🗺️ 3. Development Roadmap

### Phase 1: Complete Recruiter Dashboard Views
1. Build `/dashboard` overview showing active job counts, candidates assessed, and average candidate scores.
2. Build `/jobs/new` form consuming `trpc.company.createJob` and `trpc.company.upsertInterviewConfig`.
3. Build `/jobs/[id]/questions` interface with a button to invoke `trpc.company.generateAiQuestions`.
4. Build `/interviews/[id]` candidate evaluation review screen displaying candidate transcripts and AI hiring scores.

### Phase 2: Candidate Invitation Assessment Entry
1. In `apps/candidate-web`, support query parameter: `/interview?token=[token]`.
2. When a candidate opens an invitation link, validate the token via tRPC, load the company's curated questions, and execute the assessment in the existing cockpit.
3. Save the result as a `CompanyInterview` rather than a `PracticeInterview`.

### Phase 3: Stripe / Credit Billing System
1. Replace static starter credits (100 credits) with a credit deduction rule (e.g., 20 credits per practice session).
2. Integrate Stripe Checkout or LemonSqueezy for purchasing additional credit bundles.
