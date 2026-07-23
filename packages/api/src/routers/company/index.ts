import { router } from "../../trpc";
import { companyProcedures } from "./company";
import { interviewProcedures } from "./interview";
import { inviteRecruiter } from "./invite-recruiter";
import { inviteCandidate } from "./invite-candidate";
import { jobProcedures } from "./job";
import { interviewConfigProcedures } from "./interview-config";
import { questionProcedures } from "./question";

export const companyRouter = router({
  ...companyProcedures,
  ...jobProcedures,
  ...interviewProcedures,
  ...interviewConfigProcedures,
  ...questionProcedures,
  inviteRecruiter,
  inviteCandidate,
});
