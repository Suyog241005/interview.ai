import { candidateAuthRouter } from "./routers/auth/candidate-auth";
import { candidateRouter } from "./routers/candidate";
import { companyRouter } from "./routers/company";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return {
      message: "hello world",
    };
  }),
  candidateAuth: candidateAuthRouter,
  candidate: candidateRouter,
  company: companyRouter,
});

export type AppRouter = typeof appRouter;
