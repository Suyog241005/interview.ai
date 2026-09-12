# High-Level Workflows & User Journeys

This document illustrates the operational journeys of **Candidates**, **Recruiters**, and the underlying **AI Evaluation Loop**.

---

## 1. Candidate Practice Workflow

Candidates use `apps/candidate-web` to prepare for high-stakes technical and behavioral interviews.

```mermaid
sequenceDiagram
    autonumber
    actor Candidate
    participant CW as Candidate Web (:5173)
    participant SRV as Server & tRPC (:8000)
    participant AI as Gemini 2.5 Flash
    participant DB as PostgreSQL (Prisma)

    Candidate->>CW: 1. Sign In (Better Auth)
    CW->>SRV: Authenticate session
    SRV->>DB: Fetch/Create Candidate record (Credits: 100)

    Candidate->>CW: 2. Upload Resume (PDF)
    CW->>SRV: Upload file buffer (tRPC: resume.analyze)
    SRV->>AI: Send PDF buffer to Gemini (analyzeResume)
    AI-->>SRV: Structured JSON (skills, experience, projects)
    SRV->>DB: Save Resume & ResumeAnalysis

    Candidate->>CW: 3. Configure Practice Session (Role, Track: TECH/HR, Exp)
    CW->>SRV: Request Question Generation (tRPC: practice.createPracticeInterview)
    SRV->>AI: generatePracticeInterviewQuestions (Resume context + Role prompt)
    AI-->>SRV: 5 Structured Questions (Easy -> Hard)
    SRV->>DB: Create PracticeInterview & 5 PracticeQuestions

    Candidate->>CW: 4. Enter Live Cockpit
    loop For each Question (1 to 5)
        CW->>CW: AI voice reads question (SpeechSynthesis)
        CW->>CW: Candidate answers verbally (SpeechRecognition real-time transcript)
        CW->>SRV: Submit Answer (tRPC: practice.submitAnswer)
        SRV->>DB: Store userAnswer & timeTaken
    end

    CW->>SRV: 5. Finish Interview (tRPC: practice.generatePracticeInterviewReport)
    SRV->>AI: generatePracticeInterviewReport (Questions + Answers)
    AI-->>SRV: Overall Score, Strengths, Weaknesses, Recommendation
    SRV->>DB: Save PracticeInterviewReport & update status to COMPLETED
    CW->>Candidate: 6. Display Interactive Diagnostic Report
```

### Key Stages of Candidate Practice:
1. **Resume Ingestion & Intelligence**:
   - Resumes in PDF format are processed multimodal-style by Gemini 2.5 Flash.
   - Outputs: Full contact summary, skills list, validated projects, work experience duration, and recommended roles.
2. **5-Stage Curriculum Composition**:
   - **Q1 (EASY)**: Introduction & Background Overview.
   - **Q2 (EASY)**: Core Stack Competency (Tech) or Communication (HR).
   - **Q3 (MEDIUM)**: Practical Project Deep Dive (Tech) or Behavioral Scenarios (HR).
   - **Q4 (MEDIUM)**: Problem Solving & Troubleshooting (Tech) or Situational Judgment (HR).
   - **Q5 (HARD)**: System Scalability & Architectural Tradeoffs (Tech) or Cultural Alignment (HR).
3. **Cockpit Execution**:
   - Circular countdown timer with per-question limits (default 60s).
   - Speech synthesis for audio delivery paired with an AI video avatar.
   - Live speech recognition capturing candidate transcripts in real time.
4. **Diagnostic Feedback**:
   - Overall score (0–100).
   - Communication, Confidence, and Correctness sub-scores.
   - Bulleted list of candidate strengths, specific weaknesses, and actionable recommendations.

---

## 2. Recruiter Hiring Campaign Workflow

Recruiters use `apps/recruiter-web` to streamline technical and behavioral candidate assessments.

```mermaid
sequenceDiagram
    autonumber
    actor Recruiter
    actor Candidate
    participant RW as Recruiter Web (:5174)
    participant CW as Candidate Web (:5173)
    participant SRV as Server & tRPC
    participant AI as Gemini 2.5 Flash
    participant DB as PostgreSQL

    Recruiter->>RW: 1. Sign Up & Setup Company (Better Auth)
    RW->>SRV: tRPC: company.createCompany
    SRV->>DB: Create Company & Recruiter record

    Recruiter->>RW: 2. Invite Team Recruiters (Optional)
    RW->>SRV: tRPC: company.inviteRecruiter
    SRV->>DB: Generate RecruiterInvitation token

    Recruiter->>RW: 3. Create Job Opening (Title, Description, Experience)
    RW->>SRV: tRPC: company.createJob
    SRV->>DB: Create Job (Status: DRAFT/OPEN)

    Recruiter->>RW: 4. Configure Interview Parameters
    RW->>SRV: tRPC: company.createInterviewConfig (Question Count, Mode, Prompts)
    SRV->>AI: generateCompanyInterviewQuestions
    AI-->>SRV: Auto-generated tailored questions
    SRV->>DB: Save InterviewConfig & CompanyQuestions

    Recruiter->>RW: 5. Invite Candidate (Email, Name)
    RW->>SRV: tRPC: company.inviteCandidate
    SRV->>DB: Generate Invitation record with unique token

    Candidate->>CW: 6. Clicks Assessment Link (Invitation Token)
    CW->>SRV: Validate Token & load company questions
    Candidate->>CW: 7. Complete Live AI Interview
    CW->>SRV: Submit answers & generate CompanyInterviewReport
    SRV->>DB: Persist CompanyInterview & Report

    Recruiter->>RW: 8. Access Review Cockpit
    RW->>SRV: tRPC: company.getJobInterviews & getInterviewReport
    RW->>Recruiter: Inspect candidate transcripts, scores, strengths, weaknesses & recommendation
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
