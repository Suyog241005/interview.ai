import { router } from "../../trpc";
import { createResume } from "./create";
import { analyzeResume } from "./analyze";

export const practiceResumeRouter = router({
  createResume,
  analyzeResume,
});
