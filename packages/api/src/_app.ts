import { candidateAuthRouter } from "./routers/auth/candidate-auth";
import { recruiterAuthRouter } from "./routers/auth/recruiter-auth";
import { candidateRouter } from "./routers/candidate";
import { companyRouter } from "./routers/company";
import { companyInterviewRouter } from "./routers/company-interview";
import { practiceInterviewRouter } from "./routers/practice/practice-interview";
import { practiceResumeRouter } from "./routers/resume";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return {
      message: "hello world",
    };
  }),
  candidateAuth: candidateAuthRouter,
  recruiterAuth: recruiterAuthRouter,
  practice: practiceInterviewRouter,
  candidate: candidateRouter,
  company: companyRouter,
  companyInterview: companyInterviewRouter,
  resume: practiceResumeRouter,
});

export type AppRouter = typeof appRouter;
