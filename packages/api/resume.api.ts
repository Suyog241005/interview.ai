import type { ResumeAnalysis } from "@interview.ai/types";
import type { APIClient } from "./api-client";

export class ResumeAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  resumeAnalysis(data: FormData) {
    return this.client.post<ResumeAnalysis, FormData>("/resume/analyze", data);
  }
}
