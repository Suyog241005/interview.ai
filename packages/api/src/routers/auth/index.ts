import { router } from "../../trpc";
import { candidateAuthRouter } from "./candidate-auth";
import { recruiterAuthRouter } from "./recruiter-auth";

export const authRouter = router({
  candidate: candidateAuthRouter,
  recruiter: recruiterAuthRouter,
});
