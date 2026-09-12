# AI Engineering, Prompts & Evaluation Rubrics

This document specifies the artificial intelligence architecture, system prompts, multimodal payload structures, structured output schemas, and evaluation rubrics powering **Interview.AI**.

---

## 🧠 Model Configuration & Runtime

| Parameter | Specification | Purpose |
| :--- | :--- | :--- |
| **Model** | `gemini-2.5-flash` | Ultra-fast multimodal and reasoning LLM by Google DeepMind |
| **SDK** | Vercel AI SDK (`ai` v6.0 / v7.0 + `@ai-sdk/google`) | Provider-agnostic LLM orchestration with schema enforcement |
| **Execution Function** | `generateText()` with `output: Output.object({ schema })` | Guarantees strict JSON schema compliance without regex parsing |
| **Input Modalities** | Multimodal (Text + PDF Binary Buffer) | Direct PDF document parsing without external OCR or PDF text extraction |

---

## 📑 AI Service Operations (`packages/api/src/services/ai.service.ts`)

### 1. Multimodal Resume Analysis (`analyzeResume`)

#### Input Signature:
- `fileBuffer: Buffer`: Raw byte buffer of the candidate's PDF resume.

#### Multimodal Payload Construction:
```typescript
const { text } = await generateText({
  model: google("gemini-2.5-flash"),
  output: Output.object({ schema: ResumeAnalysisSchema }),
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Analyze this resume and extract the key details in structured JSON format.",
        },
        {
          type: "file",
          data: fileBuffer,
          mediaType: "application/pdf",
        },
      ],
    },
  ],
});
```

#### Enforced Output Zod Schema (`ResumeAnalysisSchema`):
```typescript
{
  name: string;
  email?: string | null;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies?: string[];
  }>;
  experienceyears?: number | null;
  education: Array<{
    degree: string;
    institution: string;
    year: string | number;
  }>;
  suggestedRoles: string[];
  summary: string; // Markdown executive profile summary
}
```

---

### 2. Practice Question Synthesis (`generatePracticeInterviewQuestions`)

#### Goal:
Generates exactly 5 progressive questions tailored to the candidate's verified background and chosen role track (`TECHNICAL` vs. `HR`).

#### Prompt Template:
```text
You are an expert enterprise tech and HR recruiter. 
Generate exactly 5 interview questions tailored precisely to this candidate's profile and target job role.

--- CANDIDATE RESUME ANALYSIS ---
Name: {name}
Email: {email}
Professional Experience: {experienceyears}
Core Skills: {skills}
Featured Projects: {projects}
Education Matrix: {education}
Executive Summary: {summary}

--- INTERVIEW CONFIGURATION ---
Target Job Title: {role}
Required Experience Level: {experience}
Interview Category Track: {interviewMode} (Options: TECHNICAL or HR)

--- QUESTION COMPOSITION MATRIX ---
Generate exactly 5 sequential questions conforming to these strict tracks. Ensure each question text prompt is clear, direct, and under 15 words to optimize for natural verbal flow.

Question 1:
- Focus: Professional Introduction and background overview.
- Difficulty: EASY
- Category: Introduction

Question 2:
- Focus: {TECHNICAL: "Core technical stack competency, syntax, and foundational architectures." | HR: "Professional communication abilities, listening accuracy, and interpersonal clarity."}
- Difficulty: EASY
- Category: {TECHNICAL: "Core Skills" | HR: "Communication"}

Question 3:
- Focus: {TECHNICAL: "Practical engineering execution regarding listed projects and infrastructure choices." | HR: "Behavioral scenarios regarding corporate conflicts, execution ownership, or teamwork dynamics."}
- Difficulty: MEDIUM
- Category: {TECHNICAL: "Project Deep Dive" | HR: "Behavioral"}

Question 4:
- Focus: {TECHNICAL: "Analytical troubleshooting, algorithmic strategy, or logical bug resolution patterns." | HR: "Situational judgment criteria, operational prioritization under crunch, or team alignment."}
- Difficulty: MEDIUM
- Category: {TECHNICAL: "Problem Solving" | HR: "Situational"}

Question 5:
- Focus: {TECHNICAL: "Complex technical reasoning, system design scalability, or theoretical tradeoffs." | HR: "Long-term professional ambition, culture match, alignment, and fast learning aptitude."}
- Difficulty: HARD
- Category: {TECHNICAL: "System Design" | HR: "Cultural Fit"}

--- OUTPUT COMPLIANCE REGULATION ---
Return the payload strictly as a structured JSON object matching the target database enums.
```

#### Enforced Output Zod Schema (`CreatePracticeInterviewQuestionsSchema`):
```typescript
{
  questions: Array<{
    questionText: string;     // Must be concise (under 25 words) for natural TTS verbal flow
    difficulty: "EASY" | "MEDIUM" | "HARD";
    category: string;
    timeLimitSeconds: number; // 60s for EASY, 90s for MEDIUM, 120s for HARD
    displayOrder: number;     // 1 to 5
  }>;
}
```

---

### 3. Interview Evaluation & Diagnostic Report (`generatePracticeInterviewReport`)

#### Goal:
Analyzes the candidate's spoken transcripts across all questions and produces a weighted diagnostic report.

#### Prompt Template:
```text
You are an expert {interviewMode} interviewer. Your task is to evaluate the candidate's answers to the following questions.

Interview Information:
- Interview Mode: {interviewMode}
- Role: {role}
- Experience: {experienceYears}

Questions:
[For each question:]
Question: {questionText}
Difficulty: {difficulty}
Category: {category}
Time Limit: {timeLimitSeconds}
User Answer: {userAnswer}

Return the response in the following JSON format:
{
  "aiFeedback": "string",
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "summary": "string",
  "recommendation": "string"
}
```

#### Scoring Metrics Breakdown:
- **`overallScore` (0–100)**: Composite hiring readiness score.
- **`correctnessScore` (0–100)**: Accuracy of domain claims, architectural soundness, and problem resolution logic.
- **`communicationScore` (0–100)**: Articulation, conciseness, verbal flow, and use of structured formats (e.g. STAR method).
- **`confidenceScore` (0–100)**: Decisiveness, tone assertiveness, and pacing under time pressure.
- **`strengths`**: 3–5 bullet points highlighting standout candidate capabilities.
- **`weaknesses`**: 2–4 targeted growth areas and technical/behavioral deficiencies.
- **`recommendation`**: Actionable guidance for next career steps and hiring suitability.

---

### 4. Recruiter Company Interview Question Synthesis (`generateCompanyInterviewQuestions`)

#### Goal:
Allows recruiters to automatically generate calibrated interview questions directly from job opening specifications.

#### Prompt Template:
```text
You are an expert recruiter generating interview questions for a hiring process.
Job Title: {jobTitle}
Job Description: {jobDescription}
Required Experience Years: {experienceYears}
Interview Track: {interviewMode}
Custom Prompt / Instructions: {promptText || "None"}

Generate exactly {questionCount} sequential interview questions conforming strictly to the JSON schema.
Each question text should be under 25 words to allow natural verbal flow.
```

---

## ⚙️ Fallbacks & Error Recovery

1. **Missing Resume Fallback**: If the candidate creates a practice session without a resume, the prompt injects: `"No resume was provided. Generate standard role-related questions."`
2. **Concise Phrasing Enforcement**: All question prompts explicitly enforce concise phrasing (under 15–25 words) to prevent Browser Speech Synthesis (`window.speechSynthesis`) from sounding robotic during extended monologues.
3. **Strict Schema Failure Handling**: If the LLM produces invalid JSON, Zod parsing throws an error that tRPC catches and converts into a typesafe `INTERNAL_SERVER_ERROR`.
