import {
  CreatePracticeInterviewQuestionsSchema,
  type CreatePracticeInterviewQuestions,
} from "./ai";
import {
  CreatePracticeInterviewSchema,
  StartPracticeInterviewSchema,
  type CreatePracticeInterviewRequest,
  type CreatePracticeInterviewResponse,
} from "./interview";
import { type ResumeAnalysis, ResumeAnalysisSchema } from "./resume";
import { type GetUserResponse } from "./user";

export type {
  CreatePracticeInterviewRequest,
  CreatePracticeInterviewResponse,
  ResumeAnalysis,
  CreatePracticeInterviewQuestions,
  GetUserResponse,
};

export {
  CreatePracticeInterviewSchema,
  ResumeAnalysisSchema,
  CreatePracticeInterviewQuestionsSchema,
  StartPracticeInterviewSchema,
};
