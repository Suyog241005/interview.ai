import z from "zod";
import {
  InterviewMode,
  type PracticeInterview,
  type PracticeQuestion,
} from "../db";
import { ResumeAnalysisSchema } from "../resume";

const interviewModeValues = Object.values(InterviewMode) as [
  InterviewMode,
  ...InterviewMode[],
];
export const CreatePracticeInterviewSchema = z.object({
  role: z.string(),
  interviewMode: z.enum(interviewModeValues),
  experienceYears: z.number(),
  resumeId: z.string().optional(),
});

export type CreatePracticeInterviewRequest = z.infer<
  typeof CreatePracticeInterviewSchema
>;
export type CreatePracticeInterviewResponse = PracticeInterview;

export const GetPracticeInterviewSchema = z.object({
  id: z.string(),
});

export type GetPracticeInterviewRequest = z.infer<
  typeof GetPracticeInterviewSchema
>;
export type GetPracticeInterviewResponse = PracticeInterview;

export const CreatePracticeInterviewQuestionsSchema = z.object({
  practiceinterviewId: z.string(),
  resumeAnalysis: ResumeAnalysisSchema.nullable(),
  values: CreatePracticeInterviewSchema,
});

export const StartPracticeInterviewSchema = z.object({
  practiceinterviewId: z.string(),
});

export type StartPracticeInterviewRequest = z.infer<
  typeof StartPracticeInterviewSchema
>;
export type StartPracticeInterviewResponse = PracticeInterview;

export const SubmitAnswerSchema = z.object({
  interviewId: z.string(),
  questionId: z.string(),
  userAnswer: z.string(),
});
export type SubmitAnswerRequest = z.infer<typeof SubmitAnswerSchema>;
export type SubmitAnswerResponse = PracticeQuestion;

export const GeneratePracticeInterviewReportSchema = z.object({
  practiceinterviewId: z.string(),
});

export type GeneratePracticeInterviewReportRequest = z.infer<
  typeof GeneratePracticeInterviewReportSchema
>;
export type GeneratePracticeInterviewReportResponse = PracticeInterview;

export const CreateCompanyInterview = z.object({
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  candidateId: z.string(),
  jobId: z.string(),
});
export type CreateCompanyInterviewRequest = z.infer<
  typeof CreateCompanyInterview
>;

export const UpdateCompanyInterview = CreateCompanyInterview.partial().extend({
  interviewId: z.string(),
});
export type UpdateCompanyInterviewRequest = z.infer<
  typeof UpdateCompanyInterview
>;

export const GetCompanyInterviewById = z.object({
  interviewId: z.string(),
});
export type GetCompanyInterviewByIdRequest = z.infer<
  typeof GetCompanyInterviewById
>;
