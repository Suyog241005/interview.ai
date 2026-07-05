import { useLogin } from "./auth/use-login";
import { useLogout } from "./auth/use-logout";
import { useCreateInterviewQuestions } from "./interview/use-create-interview-questions";
import { useCreateInterview } from "./interview/use-create-interview";
import { useGetInterview } from "./interview/use-get-interview";
import { useGenerateReport } from "./interview/use-generate-report";
import { useStartInterview } from "./interview/use-start-interview";
import { useSubmitAnswer } from "./interview/use-submit-answer";
import { useGetInterviewHistory } from "./interview/use-get-interview-history";
import { useAnalyzeResume } from "./resume/use-analyze-resume";
import { useGetUser } from "./user/use-get-user";

export {
  useLogin,
  useLogout,
  useCreateInterviewQuestions,
  useCreateInterview,
  useGetInterview,
  useGenerateReport,
  useStartInterview,
  useSubmitAnswer,
  useGetInterviewHistory,
  useAnalyzeResume,
  useGetUser,
};
