import { router } from "../../trpc";
import { companyProcedures } from "./company";
import { inviteRecruiter } from "./invite-recruiter";
import { jobProcedures } from "./job";

export const companyRouter = router({
  ...companyProcedures,
  ...jobProcedures,
  inviteRecruiter,
});
