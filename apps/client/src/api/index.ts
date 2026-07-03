// /auth/
// /auth/logout

// /user/

// /resume/analyze

// /interview/create
// /interview/start/:id
// /interview/questions
// /interview/get-interview/:interviewId/:userId
// /interview/submit-answer
// /interview/get-report/:id

import { APIClient } from "./api-client";

export class API {
  private apiClient: APIClient;

  constructor() {
    this.apiClient = new APIClient();
  }

  async auth(data: any) {
    return this.apiClient.post("/auth", data);
  }

  async authLogout(data: any) {
    return this.apiClient.post("/auth/logout", data);
  }

  async user(data: any) {
    return this.apiClient.get("/user", data);
  }

  async resumeAnalyze(data: any) {
    return this.apiClient.post("/resume/analyze", data);
  }

  async interviewCreate(data: any) {
    return this.apiClient.post("/interview/create", data);
  }

  async interviewStart(id: string, data: any) {
    return this.apiClient.patch(`/interview/start/${id}`, data);
  }

  async interviewQuestions(data: any) {
    return this.apiClient.post("/interview/questions", data);
  }

  async interviewGetInterview(interviewId: string, userId: string) {
    return this.apiClient.get(
      `/interview/get-interview/${interviewId}/${userId}`,
    );
  }

  async interviewSubmitAnswer(data: any) {
    return this.apiClient.post("/interview/submit-answer", data);
  }

  async interviewGetReport(id: string) {
    return this.apiClient.get(`/interview/get-report/${id}`);
  }
}

