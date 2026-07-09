import {
  AuthSchema,
  type AuthRequest,
  type AuthResponse,
  type LogoutResponse,
} from "./auth/types";
import {
  InterviewQuestionsSchema,
  AnswerEvaluationSchema,
  type AnswerEvaluation,
  type InterviewQuestions,
} from "./ai/types.ts";
import {
  CreateInterviewSchema,
  type CreateInterviewRequest,
  type CreateInterviewResponse,
  type InterviewWithQuestion,
} from "./interview/types.ts";
import { type ResumeAnalysis, ResumeAnalysisSchema } from "./resume/types.ts";
import { type Interview, type Question } from "./db/types";
import { type GetUserResponse } from "./user/types";

export type {
  AuthRequest,
  AuthResponse,
  LogoutResponse,
  CreateInterviewRequest,
  CreateInterviewResponse,
  ResumeAnalysis,
  InterviewWithQuestion,
  Question,
  Interview,
  AnswerEvaluation,
  InterviewQuestions,
  GetUserResponse
};

export {
  AuthSchema,
  CreateInterviewSchema,
  ResumeAnalysisSchema,
  InterviewQuestionsSchema,
  AnswerEvaluationSchema,
};
