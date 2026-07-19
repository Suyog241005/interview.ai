import { router } from "../../trpc";
import { createCompany } from "./create";
import { getCompany } from "./get";
import { updateCompany } from "./update";
import { deleteCompany } from "./delete";
import { inviteRecruiter } from "./invite-recruiter";

export const companyRouter = router({
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  inviteRecruiter,
});
