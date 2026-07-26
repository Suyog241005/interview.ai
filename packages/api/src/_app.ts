import { candidateAuthRouter } from "./routers/auth/candidate-auth";
import { candidateRouter } from "./routers/candidate";
import { companyRouter } from "./routers/company";
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
  practice: practiceInterviewRouter,
  candidate: candidateRouter,
  company: companyRouter,
  resume: practiceResumeRouter,
});

export type AppRouter = typeof appRouter;
