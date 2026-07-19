import {
  CreatePracticeInterviewQuestionsSchema,
  type CreatePracticeInterviewQuestions,
} from "./ai/index.ts";
import {
  CreatePracticeInterviewSchema,
  StartPracticeInterviewSchema,
  type CreatePracticeInterviewRequest,
  type CreatePracticeInterviewResponse,
} from "./interview/index.ts";
import { type ResumeAnalysis, ResumeAnalysisSchema } from "./resume/index.ts";
import { type GetUserResponse } from "./user/index.ts";

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
