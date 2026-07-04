import { APIClient } from "./api-client";
import { AuthAPI } from "./auth.api";
import { InterviewAPI } from "./interview.api";
import { ResumeAPI } from "./resume.api";
import { UserAPI } from "./user.api";

export { APIClient } from "./api-client";

export * from "./auth.api";
export * from "./interview.api";
export * from "./resume.api";
export * from "./user.api";

export class API {
  auth: AuthAPI;
  interview: InterviewAPI;
  resume: ResumeAPI;
  user: UserAPI;

  constructor(client: APIClient = new APIClient()) {
    this.auth = new AuthAPI(client);
    this.interview = new InterviewAPI(client);
    this.resume = new ResumeAPI(client);
    this.user = new UserAPI(client);
  }
}

export const api = new API();
