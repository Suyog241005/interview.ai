# High-Level Workflows & User Journeys

This document illustrates the operational journeys of **Candidates**, **Recruiters**, and the underlying **AI Evaluation Loop**, capturing all technical steps, storage pipelines, and timer behaviors.

---

## 1. Candidate Practice Workflow

Candidates use `apps/candidate-web` to prepare for high-stakes technical and behavioral interviews.

```mermaid
sequenceDiagram
    autonumber
    actor Candidate
    participant CW as Candidate Web (:5173)
    participant CLOUD as Cloudinary CDN
    participant SRV as Express Server & tRPC (:3001)
    participant AI as Gemini 2.5 Flash
    participant DB as PostgreSQL (Neon)

    Candidate->>CW: 1. Sign In (Google OAuth / Email via Better Auth)
    CW->>SRV: Authenticate session cookie
    SRV->>DB: Fetch/Create Candidate record (Credits: 100)

    Candidate->>CW: 2. Upload Resume (PDF < 5MB)
    CW->>CLOUD: POST to api.cloudinary.com with upload_preset 'interview-ai'
    CLOUD-->>CW: Return secure_url
    CW->>SRV: tRPC: resume.createResume (fileName, secure_url)
    SRV->>DB: Insert Resume row
    CW->>SRV: tRPC: resume.analyzeResume (resumeId)
    SRV->>CLOUD: Download PDF buffer
    SRV->>AI: Send PDF buffer to Gemini (analyzeResume via Vercel AI SDK)
    AI-->>SRV: Structured JSON (name, skills, projects, experienceyears, education, summary)
    SRV->>DB: Insert ResumeAnalysis row linked to Resume
    SRV-->>CW: Return extracted candidate data (pre-populates form)

    Candidate->>CW: 3. Configure Practice Session (Role, Track: TECH/HR, Experience Years)
    CW->>SRV: tRPC: practice.createPracticeInterview (role, mode, exp, resumeId)
    SRV->>DB: Insert PracticeInterview (Status: PENDING)
    CW->>SRV: tRPC: practice.createPracticeInterviewQuestions (practiceinterviewId, resumeAnalysis, values)
    SRV->>AI: generatePracticeInterviewQuestions (Resume analysis + Role prompt)
    AI-->>SRV: 5 Structured Questions
    Note over SRV,DB: Dynamic Timers Applied:<br/>EASY = 60s, MEDIUM = 90s, HARD = 120s
    SRV->>DB: Insert 5 PracticeQuestion rows with calibrated timers
    SRV-->>CW: Return practiceInterviewWithQuestions

    Candidate->>CW: 4. Click 'Start Interview'
    CW->>SRV: tRPC: practice.startPracticeInterview (practiceinterviewId)
    SRV->>DB: Update status = IN_PROGRESS

    loop For each Question (1 to 5)
        CW->>CW: Audio synthesized aloud (SpeechSynthesis, rate 0.92, pitch 0.98)
        CW->>CW: Female AI avatar loop video plays
        CW->>CW: Radial timer counts down from question time limit
        CW->>CW: Candidate speaks answer (SpeechRecognition captures continuous transcript)
        Candidate->>CW: Clicks 'Submit Answer' (or timer expires)
        CW->>SRV: tRPC: practice.submitAnswer (interviewId, questionId, userAnswer)
        SRV->>DB: Store userAnswer & mark isAnswered = true
    end

    CW->>SRV: 5. Finalize Session: tRPC practice.generatePracticeInterviewReport
    SRV->>AI: generatePracticeInterviewReport (all questions + candidate spoken answers)
    AI-->>SRV: Overall Score, Strengths, Weaknesses, Summary, Recommendation
    SRV->>DB: Create PracticeInterviewReport & set status = COMPLETED
    SRV-->>CW: Return completed session with report
    CW->>Candidate: 6. Display Interactive Diagnostic Evaluation Dashboard
```

---

## 2. Recruiter Team & Campaign Workflow

Recruiters use `apps/recruiter-web` to manage corporate profiles, coordinate team hiring, post job openings, and issue automated candidate assessments.

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Company Owner
    actor Recruiter as Team Recruiter
    participant RW as Recruiter Web (:5174)
    participant SRV as Server & tRPC
    participant DB as PostgreSQL

    Note over Owner,DB: Phase A: Workspace Setup & Team Invites
    Owner->>RW: 1. Sign In & Create Company (name, website, logoUrl)
    RW->>SRV: tRPC: company.createCompany
    SRV->>DB: Transaction: Create Company & assign Owner as first Recruiter

    Owner->>RW: 2. Invite Colleague (email)
    RW->>SRV: tRPC: company.inviteRecruiter
    SRV->>SRV: Generate 12-char Crockford base32 token (7-day expiry)
    SRV->>DB: Insert RecruiterInvitation (Status: PENDING)

    Recruiter->>RW: 3. Receives Token & Clicks Acceptance Link
    Recruiter->>RW: Signs In with invited email
    RW->>SRV: tRPC: recruiterAuth.acceptInvitation (token)
    SRV->>SRV: Verify token validity & match email with session
    SRV->>DB: Transaction: Create Recruiter profile & update status = ACCEPTED
```

```mermaid
sequenceDiagram
    autonumber
    actor Recruiter as Recruiter
    actor Candidate as Job Candidate
    participant RW as Recruiter Web (:5174)
    participant CW as Candidate Web (:5173)
    participant SRV as Server & tRPC
    participant AI as Gemini 2.5 Flash
    participant DB as PostgreSQL

    Note over Recruiter,DB: Phase B: Job Campaign & Interview Configuration
    Recruiter->>RW: 1. Create Job Opening (Title, Description, Experience, Status: OPEN)
    RW->>SRV: tRPC: company.createJob
    SRV->>DB: Transaction: Create Job & assign Recruiter to JobRecruiter

    Recruiter->>RW: 2. Configure Interview (Duration: 30m, Count: 5, Track: TECH, Custom Prompt)
    RW->>SRV: tRPC: company.upsertInterviewConfig
    SRV->>DB: Upsert InterviewConfig for Job

    Recruiter->>RW: 3. Trigger Question Generation (or manually add questions)
    RW->>SRV: tRPC: company.generateAiQuestions (interviewId)
    SRV->>AI: generateCompanyInterviewQuestions (Job title, description, exp, config prompt)
    AI-->>SRV: Generated structured questions
    SRV->>DB: Overwrite company questions with calibrated timers (60s / 90s / 120s)

    Note over Recruiter,Candidate: Phase C: Candidate Invitation & Assessment
    Recruiter->>RW: 4. Invite Candidate (candidateEmail, candidateName, jobId)
    RW->>SRV: tRPC: company.inviteCandidate
    SRV->>SRV: Generate 16-char invite token (7-day expiry)
    SRV->>DB: Insert Invitation record

    Candidate->>CW: 5. Candidate opens invitation link (/interview?token=xyz)
    CW->>SRV: Validate Invitation & create CompanyInterview
    Candidate->>CW: 6. Takes Live AI Voice Interview in Cockpit
    CW->>SRV: Submits spoken answers & triggers CompanyInterviewReport
    SRV->>DB: Save report & mark interview status = COMPLETED

    Recruiter->>RW: 7. Reviews Submissions: tRPC company.getCompanyInterviewById
    RW->>Recruiter: Inspects candidate spoken transcript, scoring breakdown, and hiring recommendation
```

---

## 3. AI Evaluation & Scoring Pipeline

The server's AI service (`packages/api/src/services/ai.service.ts`) executes a deterministic, schema-enforced pipeline:

```mermaid
flowchart LR
    INPUT["Candidate Answers + Questions + Role Context"] --> PROMPT["Structured System Prompt<br/>(Rubric & Enums)"]
    PROMPT --> LLM["Google Gemini 2.5 Flash<br/>via Vercel AI SDK"]
    LLM --> VALIDATION["Zod Schema Validation<br/>(Output.object)"]
    VALIDATION --> DB_WRITE["Prisma Transaction Write<br/>(PracticeReport / CompanyReport)"]
```

### Scoring Dimensions:
- **Correctness Score (0–100)**: Accuracy of technical claims, algorithmic soundness, and domain competence.
- **Communication Score (0–100)**: Articulation, structure (e.g., STAR method), conciseness, and verbal clarity.
- **Confidence Score (0–100)**: Decisiveness, tone consistency, and response readiness under time constraints.
- **Overall Score**: Weighted composite index reflecting role suitability.
