import z from "zod";
import {
  AuthSchema,
  type AuthRequest,
  type AuthResponse,
  type LogoutResponse,
} from "./auth/types";
import {
  CreateInterviewSchema,
  type CreateInterviewRequest,
  type CreateInterviewResponse,
  type InterviewWithQuestion
} from "./interview/types";
import { type ResumeAnalysis, ResumeAnalysisSchema } from "./resume";
import { type Question } from "./db/types";


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
export const AnswerEvaluationSchema = z.array(
  z.object({
    id: z.string().describe("Question's Id"),
    userAnswer: z.string().describe("User's answer to the question"),
    confidenceScore: z.number().describe("Confidence Score of the answer"),
    communicationScore: z
      .number()
      .describe("Communication Score of the answer"),
    correctnessScore: z.number().describe("Correctness Score of the answer"),
    questionScore: z.number().describe("Question Score of the answer"),
    aiFeedback: z
      .string()
      .describe("Concise interview feedback. Maximum 15 words."),
  }),
);
export type AnswerEvaluation = z.infer<typeof AnswerEvaluationSchema>;

export { type Question };

export type Interview = {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  score: number;
  role: string;
  experience: string;
  interviewMode: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type {
  AuthRequest,
  AuthResponse,
  LogoutResponse,
  CreateInterviewRequest,
  CreateInterviewResponse,
  ResumeAnalysis,
  InterviewWithQuestion
};

export { AuthSchema, CreateInterviewSchema, ResumeAnalysisSchema };
