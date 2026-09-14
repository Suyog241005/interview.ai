# Implementation Status, Roadmap & Next Steps

Current state of **Interview.AI**: what works end to end, what is deliberately thin, and what comes next.

---

## 🚦 System Implementation Matrix

```
[████████████████████] 100% — Shared Types & Zod Schemas (@interview.ai/types)
[████████████████████] 100% — Database Schema & Prisma ORM (@interview.ai/db)
[████████████████████] 100% — Better Auth Configuration (@interview.ai/better-auth)
[████████████████████] 100% — Shared UI Component System (@interview.ai/ui)
[████████████████████] 100% — Gemini 2.5 Flash AI Service (Vercel AI SDK)
[████████████████████] 100% — Express Server & tRPC API Routers (apps/server, packages/api)
[████████████████████] 100% — Candidate Web: practice flow (apps/candidate-web)
[████████████████████] 100% — Candidate Web: invited company assessment (/interview?token=)
[██████████████████░░]  90% — Recruiter Web (apps/recruiter-web)
[████████████████░░░░]  80% — Gateway Portal (apps/gateway)
```

---

## ✅ 1. What Works End to End

### Candidate practice (`apps/candidate-web`)
Resume upload → Gemini analysis → tailored questions → voice cockpit → scored report → history. Unchanged.

### Recruiter suite (`apps/recruiter-web`)
| Route | Backed by |
| :--- | :--- |
| `/onboarding` | `company.createCompany` (owner becomes first recruiter) |
| `/accept-invite?token=` | `recruiterAuth.acceptInvitation` |
| `/dashboard` | `company.getCompany` (jobs list) |
| `/jobs/new` | `company.createJob` + `company.upsertInterviewConfig` |
| `/jobs/[id]` | `company.createInterview` (candidate-less template), `generateAiQuestions`, question CRUD, `inviteCandidate`, `getInvitations` (status per invite, link to the interview once accepted) |
| `/interviews` | `company.getAllCompanyInterviews` (templates filtered out) |
| `/interviews/[id]` | `company.getCompanyInterviewById` (transcript + report) |
| `/team` | `company.inviteRecruiter` + `getRecruiterInvitations` (owner only) |

### Company assessment loop (`companyInterview` router)
Recruiter invite link → candidate opens `/interview?token=` → sign in → redeem (clones the job's template interview + questions for this candidate) → same voice cockpit → Gemini report with per-question scores and feedback → visible to recruiters. Redeem is idempotent, email-checked, and rejects expired tokens.

### Data model decisions
- A `CompanyInterview` with `candidateId = null` is a **per-job template**. Recruiters generate questions on it once; every invite clones it.
- Any signed-in user becomes a `Candidate` on first use of a candidate procedure (`protectedCandidateProcedure` upserts the row).

---

## 🔨 2. Known Thin Spots

| Gap | Where | Add when |
| :--- | :--- | :--- |
| No email delivery for invites. | `inviteCandidate`, `inviteRecruiter` | Add Resend/Cloudflare Email behind the same mutations. |
| Question editing is text-only. Difficulty and time limit are not editable in the UI. | `/jobs/[id]` | `updateQuestion` already accepts them. |
| No pagination anywhere. | all list queries | Lists exceed a few hundred rows. |
| Gateway still links to both apps with static copy. | `apps/gateway` | Marketing pass. |

---

## 🗺️ 3. Roadmap

### Phase 4: Report depth
1. ~~Per-question scoring + `aiFeedback` from Gemini, shown on `/interviews/[id]`.~~ Done.
2. Recruiter-facing comparison across candidates for a job.

### Phase 5: Invitation lifecycle
1. ~~`getInvitations` per job.~~ Done. Still missing: resend, revoke (`status = REJECTED`).
2. Transactional email.

### Phase 6: Billing
1. Replace static 100 starter credits with a per-session deduction.
2. Stripe Checkout or LemonSqueezy for credit bundles.
