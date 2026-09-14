# API Reference & Procedures Catalog

This document provides an exhaustive reference for all **tRPC v11** routers, procedures, authorization middleware, input Zod schemas, and responses across **Interview.AI**.

---

## 🛡️ Authorization Procedures & Middleware

All procedures in `@interview.ai/api` are constructed using layered tRPC middleware (`packages/api/src/trpc.ts` and `packages/api/src/middleware/*`):

| Procedure | Middleware Layer | Required Auth / Context Injected | Failure Code |
| :--- | :--- | :--- | :--- |
| `publicProcedure` | None | Open access | None |
| `protectedProcedure` | Session Validation | Valid Better Auth session; injects `ctx.userId` and `ctx.session` | `UNAUTHORIZED` (401) |
| `protectedCandidateProcedure` | Candidate Profile Lookup | User must have an associated `Candidate` record; injects `ctx.candidateId` | `NOT_FOUND` (404) |
| `protectedRecruiterProcedure` | Recruiter Profile Lookup | User must have an associated `Recruiter` record; injects `ctx.recruiterId` and `ctx.companyId` | `NOT_FOUND` (404) |
| `protectedCompanyOwnerProcedure`| Company Ownership Check | User must be the `ownerId` of the `Company`; injects `ctx.companyId` | `FORBIDDEN` (403) |

---

## 🧭 Router Hierarchy (`packages/api/src/_app.ts`)

```
appRouter
├── hello                        (publicProcedure.query)
├── candidateAuth
│   └── becomeCandidate          (protectedProcedure.mutation)
├── candidate
│   └── getCandidate             (protectedCandidateProcedure.query)
├── resume
│   ├── createResume             (protectedCandidateProcedure.mutation)
│   └── analyzeResume            (protectedCandidateProcedure.mutation)
├── practice
│   ├── createPracticeInterview  (protectedCandidateProcedure.mutation)
│   ├── getPracticeInterview     (protectedCandidateProcedure.query)
│   ├── createPracticeInterviewQuestions (protectedCandidateProcedure.mutation)
│   ├── startPracticeInterview   (protectedCandidateProcedure.mutation)
│   ├── submitAnswer             (protectedCandidateProcedure.mutation)
│   ├── generatePracticeInterviewReport (protectedCandidateProcedure.mutation)
│   └── getPracticeInterviewHistory (protectedCandidateProcedure.query)
└── company
    ├── createCompany            (protectedProcedure.mutation)
    ├── getCompany               (protectedRecruiterProcedure.query)
    ├── updateCompany            (protectedCompanyOwnerProcedure.mutation)
    ├── deleteCompany            (protectedCompanyOwnerProcedure.mutation)
    ├── inviteRecruiter          (protectedCompanyOwnerProcedure.mutation)
    ├── createJob                (protectedRecruiterProcedure.mutation)
    ├── getJob                   (protectedRecruiterProcedure.query)
    ├── updateJob                (protectedRecruiterProcedure.mutation)
    ├── deleteJob                (protectedRecruiterProcedure.mutation)
    ├── upsertInterviewConfig    (protectedRecruiterProcedure.mutation)
    ├── getInterviewConfig       (protectedRecruiterProcedure.query)
    ├── inviteCandidate          (protectedRecruiterProcedure.mutation)
    ├── createInterview          (protectedRecruiterProcedure.mutation)
    ├── getAllCompanyInterviews  (protectedRecruiterProcedure.query)
    ├── getCompanyInterviewById  (protectedRecruiterProcedure.query)
    ├── updateCompanyInterview   (protectedRecruiterProcedure.mutation)
    ├── deleteCompanyInterview   (protectedRecruiterProcedure.mutation)
    ├── getQuestions             (protectedRecruiterProcedure.query)
    ├── createQuestion           (protectedRecruiterProcedure.mutation)
    ├── updateQuestion           (protectedRecruiterProcedure.mutation)
    ├── deleteQuestion           (protectedRecruiterProcedure.mutation)
    └── generateAiQuestions      (protectedRecruiterProcedure.mutation)
```

---

## 📋 Procedure Catalog

### 1. `candidateAuth` Router (`packages/api/src/routers/auth/candidate-auth.ts`)

#### `becomeCandidate`
- **Type**: `protectedProcedure.mutation`
- **Description**: Initializes a candidate profile for the logged-in user with 100 default credits.
- **Input**: None
- **Output**: `{ success: true, candidate: Candidate }`
- **Errors**: `BAD_REQUEST` if candidate profile already exists.

---

### 2. `recruiterAuth` Router (`packages/api/src/routers/auth/recruiter-auth.ts`)

#### `acceptInvitation`
- **Type**: `protectedProcedure.mutation`
- **Description**: Accepts a recruiter email invitation using an invite token.
- **Input**: `{ token: string }`
- **Validation**:
  1. Token must exist, be in `PENDING` status, and not expired (`expiresAt > now`).
  2. `invitation.email` must match the authenticated session user's email (`ctx.session.user.email`).
- **Database Transaction**: Creates `Recruiter` record with `companyId` and sets `RecruiterInvitation.status = ACCEPTED`.
- **Output**: `Recruiter` record.

---

### 3. `candidate` Router (`packages/api/src/routers/candidate/get.ts`)

#### `getCandidate`
- **Type**: `protectedCandidateProcedure.query`
- **Description**: Fetches the active candidate record including credit balance.
- **Output**: `Candidate` model (`{ id, credits, userId, createdAt, updatedAt }`).

---

### 4. `resume` Router (`packages/api/src/routers/resume/`)

#### `createResume`
- **Type**: `protectedCandidateProcedure.mutation`
- **Input**: `CreateResumeSchema`: `{ name: string, resumeUrl: string }`
- **Description**: Records an uploaded resume metadata row referencing the Cloudinary secure URL.
- **Output**: `{ resume: Resume }`

#### `analyzeResume`
- **Type**: `protectedCandidateProcedure.mutation`
- **Input**: `AnalyzeResumeSchema`: `{ resumeId: string }`
- **Description**: Downloads resume file buffer (from Cloudinary URL or local disk), invokes Gemini 2.5 Flash multimodal parsing, validates against `ResumeAnalysisSchema`, and persists `ResumeAnalysis`.
- **Output**: `{ resumeAnalysis: ResumeAnalysis }`
- **Errors**: `NOT_FOUND` if resume doesn't exist; `BAD_REQUEST` if already analyzed or download fails.

---

### 5. `practice` Router (`packages/api/src/routers/practice/practice-interview.ts`)

#### `createPracticeInterview`
- **Type**: `protectedCandidateProcedure.mutation`
- **Input**: `CreatePracticeInterviewSchema`: `{ role: string, interviewMode: "TECHNICAL" | "HR", experienceYears: number, resumeId?: string }`
- **Description**: Initializes a new practice interview in `PENDING` status.
- **Output**: `{ practiceInterview: PracticeInterview }`

#### `getPracticeInterview`
- **Type**: `protectedCandidateProcedure.query`
- **Input**: `{ id: string }`
- **Description**: Fetches practice interview record by ID for the logged-in candidate.
- **Output**: `{ practiceInterview: PracticeInterview }`

#### `createPracticeInterviewQuestions`
- **Type**: `protectedCandidateProcedure.mutation`
- **Input**: `CreatePracticeInterviewQuestionsSchema`: `{ practiceinterviewId: string, resumeAnalysis?: ResumeAnalysis, values: { role: string, experienceYears: number, interviewMode: "TECHNICAL" | "HR" } }`
- **Description**: Calls Gemini 2.5 Flash to generate 5 sequential questions. Computes dynamic time limits based on difficulty:
  - `EASY` -> 60 seconds
  - `MEDIUM` -> 90 seconds
  - `HARD` -> 120 seconds
- **Output**: `{ practiceInterviewWithQuestions: PracticeInterviewWithQuestion }`

#### `startPracticeInterview`
- **Type**: `protectedCandidateProcedure.mutation`
- **Input**: `{ practiceinterviewId: string }`
- **Description**: Validates that questions exist and transitions status from `PENDING` to `IN_PROGRESS`.
- **Output**: `{ practiceInterview: PracticeInterview }`

#### `submitAnswer`
- **Type**: `protectedCandidateProcedure.mutation`
- **Input**: `{ interviewId: string, questionId: string, userAnswer: string }`
- **Description**: Submits the candidate's speech-recognition answer transcript and marks `isAnswered: true`.
- **Output**: `{ question: PracticeQuestion }`
- **Errors**: `BAD_REQUEST` if interview is not in `IN_PROGRESS` status; `NOT_FOUND` if question doesn't belong to interview.

#### `generatePracticeInterviewReport`
- **Type**: `protectedCandidateProcedure.mutation`
- **Input**: `{ practiceinterviewId: string }`
- **Description**: Sends the complete interview transcript to Gemini 2.5 Flash. Evaluates candidate performance, creates `PracticeInterviewReport`, and sets interview status to `COMPLETED`.
- **Output**: `{ practiceInterview: PracticeInterviewWithQuestion }` (includes report and questions)

#### `getPracticeInterviewHistory`
- **Type**: `protectedCandidateProcedure.query`
- **Description**: Retrieves all practice interviews for the authenticated candidate ordered by `createdAt: desc` with questions and reports included.
- **Output**: `{ history: PracticeInterview[] }`

---

### 6. `company` Router (`packages/api/src/routers/company/`)

#### Company Profile Procedures:
- **`createCompany`** (`protectedProcedure.mutation`): Accepts `{ companyName, website?, logoUrl? }`. In a transaction, creates the `Company` record and links the creating user as the first `Recruiter`.
- **`getCompany`** (`protectedRecruiterProcedure.query`): Retrieves company details including `recruiters` and `jobs`. Includes `jobs` and `recruiters` (each with `user.name/email/image`).
- **`updateCompany`** (`protectedCompanyOwnerProcedure.mutation`): Updates company profile attributes (`name`, `website`, `logoUrl`).
- **`deleteCompany`** (`protectedCompanyOwnerProcedure.mutation`): Deletes company and cascades.

#### Team Invitation Procedures:
- **`inviteRecruiter`** (`protectedCompanyOwnerProcedure.mutation`): Generates a 12-character base32 token with 7-day expiration (`expiresAt: now + 7d`) and creates `RecruiterInvitation`.

#### Job Opening Procedures:
- **`createJob`** (`protectedRecruiterProcedure.mutation`): Accepts `{ title, description, status, minExperienceYears, maxExperienceYears? }`. Creates job and assigns current recruiter in `JobRecruiter`.
- **`getJob`** (`protectedRecruiterProcedure.query`): Fetches job with `jobRecruiters`, `company`, and `interviewConfig`.
- **`updateJob`** (`protectedRecruiterProcedure.mutation`): Updates job title, description, status (`DRAFT`, `OPEN`, `PAUSED`, `CLOSED`), or experience. Checks recruiter assignment.
- **`deleteJob`** (`protectedRecruiterProcedure.mutation`): Input `{ jobId }`. Deletes the job if it belongs to the recruiter's company.

#### Interview Configuration Procedures:
- **`upsertInterviewConfig`** (`protectedRecruiterProcedure.mutation`): Creates or updates `InterviewConfig` for a job (`questionCount`, `interviewMode`, `durationMinutes`, `prompt`).
- **`getInterviewConfig`** (`protectedRecruiterProcedure.query`): Fetches config associated with `jobId`.

#### Candidate Assessment & Invitation Procedures:
- **`inviteCandidate`** (`protectedRecruiterProcedure.mutation`): Issues a 16-character invite code valid for 7 days (`expiresAt: now + 7d`) for a specific job opening.
- **`createInterview`** (`protectedRecruiterProcedure.mutation`): Creates a scheduled `CompanyInterview` for an invited candidate.
- **`getAllCompanyInterviews`** (`protectedRecruiterProcedure.query`): Lists all candidate assessments for the company's jobs.
- **`getCompanyInterviewById`** (`protectedRecruiterProcedure.query`): Fetches detailed interview record with candidate user info, job specs, questions, and report.
- **`updateCompanyInterview`** (`protectedRecruiterProcedure.mutation`): Updates interview schedule or candidate links.
- **`deleteCompanyInterview`** (`protectedRecruiterProcedure.mutation`): Deletes company interview.

#### Question Management Procedures:
- **`getQuestions`** (`protectedRecruiterProcedure.query`): Lists questions for a company interview ordered by `displayOrder: asc`.
- **`createQuestion`** (`protectedRecruiterProcedure.mutation`): Recruiter manually appends an interview question.
- **`updateQuestion`** (`protectedRecruiterProcedure.mutation`): Edits text, difficulty, time limit, or category.
- **`deleteQuestion`** (`protectedRecruiterProcedure.mutation`): Deletes a question.
- **`generateAiQuestions`** (`protectedRecruiterProcedure.mutation`): Automatically generates a complete question set using Gemini 2.5 Flash based on the job's title, description, and `InterviewConfig`.

- **`getInvitations`** (`protectedRecruiterProcedure.query`): Input `{ jobId }`. All candidate invitations for a job, newest first, each with `interview { id, status }` so the UI can link accepted ones to `/interviews/[id]`.
- **`getRecruiterInvitations`** (`protectedCompanyOwnerProcedure.query`): All recruiter invitations for the owner's company, newest first.

Both report procedures (`practice.generatePracticeInterviewReport`, `companyInterview.generateReport`) now also write per-question `questionScore`, `correctnessScore`, `communicationScore`, `confidenceScore` and `aiFeedback` in the same transaction as the report. See `docs/ai-engineering.md`.

### 7. `companyInterview` Router (`packages/api/src/routers/company-interview/index.ts`)

Candidate side of a recruiter invitation. Recruiters build a candidate-less **template** `CompanyInterview` per job (`company.createInterview` without `candidateId`, then `generateAiQuestions`); redeeming an invitation clones the template and its questions into a per-candidate interview, so one template serves every invite for that job.

- **`getInvitation`** (`publicProcedure.query`): Input `{ token }`. Returns `{ status, expiresAt, candidateEmail, candidateName, jobTitle, companyName, interviewMode, questionCount }`. Never returns questions. `NOT_FOUND` for unknown tokens.
- **`redeemInvitation`** (`protectedCandidateProcedure.mutation`): Input `{ token }`. Session email must match `candidateEmail` (`FORBIDDEN` otherwise). On a `PENDING` token: transaction creates the candidate's `CompanyInterview` (status `PENDING`) with copied `CompanyQuestion` rows and marks the invitation `ACCEPTED`. On an already `ACCEPTED` token owned by the same candidate: returns the existing interview (idempotent; supports refresh/resume). Returns `{ interview (with questions, report), jobTitle, interviewMode }`.
- **`start`** (`protectedCandidateProcedure.mutation`): Input `{ interviewId }`. `PENDING` → `IN_PROGRESS`, sets `startedAt`. `BAD_REQUEST` if not pending or not owned.
- **`submitAnswer`** (`protectedCandidateProcedure.mutation`): Input `{ interviewId, questionId, userAnswer }`. Requires `IN_PROGRESS`. Sets `userAnswer`, `isAnswered`.
- **`generateReport`** (`protectedCandidateProcedure.mutation`): Input `{ interviewId }`. Runs the Gemini report (`generatePracticeInterviewReport`, now shape-agnostic) with the job title, min experience and config mode; writes `CompanyInterviewReport`, sets `COMPLETED` + `completedAt`. Recruiters read it via `company.getCompanyInterviewById`.

Note: `protectedCandidateProcedure` now upserts the `Candidate` row on first use, so any signed-in user can redeem an invitation without calling `candidateAuth.becomeCandidate`.
