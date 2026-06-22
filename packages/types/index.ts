import z from "zod";

// Zod Schema for structured resume analysis
export const ResumeAnalysisSchema = z.object({
  name: z.string().describe("Candidate's full name"),
  email: z.string().optional().describe("Candidate's email address"),
  skills: z
    .array(z.string())
    .describe("List of core technical and soft skills"),
  projects: z
    .array(
      z.object({
        name: z.string().describe("Project name"),
        description: z.string().describe("Project description"),
        techStack: z
          .array(z.string())
          .optional()
          .describe("Project tech stack"),
      }),
    )
    .optional()
    .describe("Projects worked on"),
  experience: z.string().describe("Experience of candidate"),
  education: z
    .array(
      z.object({
        degree: z
          .string()
          .describe("Degree name (e.g. B.S. in Computer Science)"),
        institution: z.string().describe("School or University name"),
        year: z.string().optional().describe("Graduation year"),
      }),
    )
    .describe("Education history"),
  suggestedRoles: z
    .array(z.string())
    .describe("Top 3 target job roles matching the resume profile"),
  summary: z
    .string()
    .describe("A brief 2-3 sentence professional summary of the candidate"),
});
export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;

// Zod Schema for structured interview questions
export const InterviewQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().describe("Interview question"),
        type: z.enum(["Technical", "HR"], {
          error: "Type must be Technical or HR",
        }),
        category: z
          .string()
          .optional()
          .describe("Category of the question (e.g. Data Structures, SQL)"),
        difficulty: z
          .enum(["EASY", "MEDIUM", "HARD"], {
            error: "Difficulty must be Easy, Medium, or Hard",
          })
          .describe("Difficulty level of the question"),
      }),
    )
    .describe("List of interview questions"),
});
export type InterviewQuestions = z.infer<typeof InterviewQuestionsSchema>;

//Zod schema for evaluating the answers
export const AnswerEvaluationSchema = z.object({
  userAnswer: z.string().describe("User's answer to the question"),
  confidenceScore: z.number().describe("Confidence Score of the answer"),
  communicationScore: z.number().describe("Communication Score of the answer"),
  correctnessScore: z.number().describe("Correctness Score of the answer"),
  questionScore: z.number().describe("Question Score of the answer"),
  aiFeedback: z.string().describe("AI Feedback of the answer"),
});
export type AnswerEvaluation = z.infer<typeof AnswerEvaluationSchema>;

type Question = {
  category: string | null;
  difficulty: string;
  userAnswer: string | null;
  confidenceScore: number;
  communicationScore: number;
  correctnessScore: number;
  questionScore: number;
  aiFeedback: string | null;
  id: string;
  questionText: string;
  timeLimitSeconds: number;
  interviewId: string;
  createdAt: Date;
  updatedAt: Date;
};
export { type Question };
