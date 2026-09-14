import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import {
  CreatePracticeInterviewQuestionsSchema,
  ResumeAnalysisSchema,
  type CreatePracticeInterviewQuestions,
  type ResumeAnalysis,
} from "@interview.ai/types";
import type { InterviewMode } from "@interview.ai/db/enums";

/** Structural input for report generation; both Practice and Company interviews satisfy it. */
export type InterviewReportInput = {
  interviewMode: string;
  role: string;
  experienceYears: number;
  questions: {
    id: string;
    questionText: string;
    difficulty: string;
    category: string | null;
    timeLimitSeconds: number;
    userAnswer: string | null;
  }[];
};
import {
  GenerateAiResultForPracticeInterviewSchema,
  type GenerateAiResultForPracticeInterview,
  type QuestionEvaluation,
} from "@interview.ai/types/ai";

export const analyzeResume = async (
  fileBuffer: Buffer,
): Promise<ResumeAnalysis> => {
  try {
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

    const data = JSON.parse(text);
    const response = data as ResumeAnalysis;

    return response;
  } catch (error) {
    console.error("Error analyzing resume in AI service:", error);
    throw error;
  }
};

export const generatePracticeInterviewQuestions = async ({
  resumeAnalysis,
  role,
  experience,
  interviewMode,
}: {
  resumeAnalysis?: ResumeAnalysis | null;
  role: string;
  experience: number;
  interviewMode: InterviewMode;
}): Promise<CreatePracticeInterviewQuestions> => {
  try {
    const resumeInfo = resumeAnalysis
      ? `Name: ${resumeAnalysis.name}
Email: ${resumeAnalysis.email || "Not Provided"}
Professional Experience: ${resumeAnalysis.experienceyears}
Core Skills: ${resumeAnalysis.skills ? resumeAnalysis.skills.join(", ") : "Not Provided"}
Featured Projects: ${resumeAnalysis.projects?.map((p) => `${p.name}: ${p.description}`).join("; ") || "Not Provided"}
Education Matrix: ${resumeAnalysis.education?.map((e) => `${e.degree} - ${e.institution} (${e.year})`).join("; ") || "Not Provided"}
Executive Summary: ${resumeAnalysis.summary || "Not Provided"}`
      : "No resume was provided. Generate standard role-related questions.";

    // Construct prompt with all relevant details
    const prompt = `You are an expert enterprise tech and HR recruiter. 
Generate exactly 5 interview questions tailored precisely to this candidate's profile and target job role.

--- CANDIDATE RESUME ANALYSIS ---
${resumeInfo}

--- INTERVIEW CONFIGURATION ---
Target Job Title: ${role}
Required Experience Level: ${experience}
Interview Category Track: ${interviewMode} (Options: TECHNICAL or HR)

--- QUESTION COMPOSITION MATRIX ---
Generate exactly 5 sequential questions conforming to these strict tracks. Ensure each question text prompt is clear, direct, and under 15 words to optimize for natural verbal flow.

Question 1:
- Focus: Professional Introduction and background overview.
- Difficulty: EASY
- Category: Introduction

Question 2:
- Focus: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Core technical stack competency, syntax, and foundational architectures." : "Professional communication abilities, listening accuracy, and interpersonal clarity."}
- Difficulty: EASY
- Category: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Core Skills" : "Communication"}

Question 3:
- Focus: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Practical engineering execution regarding listed projects and infrastructure choices." : "Behavioral scenarios regarding corporate conflicts, execution ownership, or teamwork dynamics."}
- Difficulty: MEDIUM
- Category: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Project Deep Dive" : "Behavioral"}

Question 4:
- Focus: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Analytical troubleshooting, algorithmic strategy, or logical bug resolution patterns." : "Situational judgment criteria, operational prioritization under crunch, or team alignment."}
- Difficulty: MEDIUM
- Category: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Problem Solving" : "Situational"}

Question 5:
- Focus: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Complex technical reasoning, system design scalability, or theoretical tradeoffs." : "Long-term professional ambition, culture match, alignment, and fast learning aptitude."}
- Difficulty: HARD
- Category: ${interviewMode.toUpperCase() === "TECHNICAL" ? "System Design" : "Cultural Fit"}

--- OUTPUT COMPLIANCE REGULATION ---
Return the payload strictly as a structured JSON object object matching the target database enums.

Expected JSON schema format:
{
  "questions": [
    {
      "questionText": "The string containing the question prompt text under 25 words",
      "difficulty": "EASY" | "MEDIUM" | "HARD",
      "category": "The categorization string based on the focus metrics above",
      "timeLimitSeconds": 60,
      "displayOrder": 1
    }
  ]
}`;
    // Call AI service
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: CreatePracticeInterviewQuestionsSchema }),
      prompt,
    });

    // Parse and validate JSON response
    const data = JSON.parse(text);
    const response: CreatePracticeInterviewQuestions =
      CreatePracticeInterviewQuestionsSchema.parse(data);

    return response;
  } catch (error) {
    console.error("Error generating interview questions in AI service:", error);
    throw error;
  }
};

export const generatePracticeInterviewReport = async (
  practiceInterview: InterviewReportInput,
): Promise<GenerateAiResultForPracticeInterview> => {
  try {
    const prompt = `
    You are an expert ${practiceInterview.interviewMode} interviewer. Your task is to evaluate the candidate's answers to the following questions.

    Interview Information:
    - Interview Mode: ${practiceInterview.interviewMode}
    - Role: ${practiceInterview.role}
    - Experience: ${practiceInterview.experienceYears}

    Questions:
    ${practiceInterview.questions.map((q) => {
      return `
      Question ID: ${q.id}
      Question: ${q.questionText}
      Difficulty: ${q.difficulty}
      Category: ${q.category}
      Time Limit: ${q.timeLimitSeconds}
      User Answer: ${q.userAnswer}
      `;
    })}

    Score every question individually (0-100 on each dimension) and echo its Question ID exactly.
    An empty or missing answer scores 0 on every dimension. Then give an overall 0-100 score,
    strengths, weaknesses, a summary and a recommendation for the whole interview.
    `;

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({
        schema: GenerateAiResultForPracticeInterviewSchema,
      }),
      prompt,
    });

    // Parse and validate JSON response
    const data = JSON.parse(text);
    const response: GenerateAiResultForPracticeInterview =
      GenerateAiResultForPracticeInterviewSchema.parse(data);

    return response;
  } catch (error) {
    console.error(
      "Error generating practice interview report in AI service:",
      error,
    );
    throw error;
  }
};

export const generateCompanyInterviewQuestions = async ({
  jobTitle,
  jobDescription,
  experienceYears,
  interviewMode,
  questionCount = 5,
  promptText,
}: {
  jobTitle: string;
  jobDescription: string;
  experienceYears: number;
  interviewMode: InterviewMode;
  questionCount?: number;
  promptText?: string | null;
}): Promise<CreatePracticeInterviewQuestions> => {
  try {
    const prompt = `You are an expert recruiter generating interview questions for a hiring process.
Job Title: ${jobTitle}
Job Description: ${jobDescription}
Required Experience Years: ${experienceYears}
Interview Track: ${interviewMode}
Custom Prompt / Instructions: ${promptText || "None"}

Generate exactly ${questionCount} sequential interview questions conforming strictly to the JSON schema.
Each question text should be under 25 words to allow natural verbal flow.`;

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: CreatePracticeInterviewQuestionsSchema }),
      prompt,
    });

    const data = JSON.parse(text);
    return CreatePracticeInterviewQuestionsSchema.parse(data);
  } catch (error) {
    console.error("Error generating company interview questions:", error);
    throw error;
  }
};

/**
 * Pairs Gemini's per-question evaluations with our question rows.
 * Matches on questionId; falls back to position if the model mangled an id.
 */
export const questionEvaluations = (
  questions: { id: string }[],
  evaluations: QuestionEvaluation[],
) =>
  questions.map((q, i) => {
    const e = evaluations.find((x) => x.questionId === q.id) ?? evaluations[i];
    return {
      questionId: q.id,
      data: {
        questionScore: Math.round(e?.questionScore ?? 0),
        correctnessScore: Math.round(e?.correctnessScore ?? 0),
        communicationScore: Math.round(e?.communicationScore ?? 0),
        confidenceScore: Math.round(e?.confidenceScore ?? 0),
        aiFeedback: e?.aiFeedback ?? null,
      },
    };
  });
