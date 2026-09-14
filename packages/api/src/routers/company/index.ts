import { router } from "../../trpc";
import { companyProcedures } from "./company";
import { interviewProcedures } from "./interview";
import { inviteRecruiter, getRecruiterInvitations } from "./invite-recruiter";
import { inviteCandidate, getInvitations } from "./invite-candidate";
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
  getRecruiterInvitations,
  inviteCandidate,
  getInvitations,
});
