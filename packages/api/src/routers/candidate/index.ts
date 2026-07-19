import { router } from "../../trpc";
import { getCandidate } from "./get";

export const candidateRouter = router({
  getCandidate,
});
