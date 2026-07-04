import z from "zod";
import { InterviewModes, type Interview, type Question } from "../db/types";
import { ResumeAnalysisSchema } from "../resume";

export type InterviewWithQuestion = Interview & {
  questions: Question[];
};

export const CreateInterviewSchema = z.object({
  interviewMode: z.enum(InterviewModes),
  role: z.string(),
  experience: z.string(),
});

export type CreateInterviewRequest = z.infer<typeof CreateInterviewSchema>;
export type CreateInterviewResponse = Interview;

export const InterviewQuestionsRequestSchema = z.object({
  interviewId: z.string(),
  resumeAnalysis: ResumeAnalysisSchema.nullable(),
  values: CreateInterviewSchema,
});

export type InterviewQuestionsRequest = z.infer<
  typeof InterviewQuestionsRequestSchema
>;
export type InterviewQuestionsResponse = InterviewWithQuestion;

export const SubmitAnswerSchema = z.object({
  interviewId: z.string(),
  questionId: z.string(),
  answer: z.string(),
  timeTaken: z.number(),
});

export type SubmitAnswerRequest = z.infer<typeof SubmitAnswerSchema>;
export type SubmitAnswerResponse = Question;

export const GenerateReportRequestSchema = z.object({
  interviewId: z.string(),
});

export type GenerateReportRequest = z.infer<typeof GenerateReportRequestSchema>;
export type GenerateReportResponse = InterviewWithQuestion;
