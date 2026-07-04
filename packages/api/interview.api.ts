import type {
  CreateInterviewRequest,
  CreateInterviewResponse,
  Interview,
} from "@interview.ai/types";
import type { APIClient } from "./api-client";
import type {
  GenerateReportRequest,
  GenerateReportResponse,
  InterviewQuestionsRequest,
  InterviewQuestionsResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "@interview.ai/types/interview/types";

export class InterviewAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  createInterview(data: CreateInterviewRequest) {
    return this.client.post<CreateInterviewResponse, CreateInterviewRequest>(
      "/interview/create",
      data,
    );
  }

  interviewQuestions(data: InterviewQuestionsRequest) {
    return this.client.post<
      InterviewQuestionsResponse,
      InterviewQuestionsRequest
    >("/interview/questions", data);
  }

  startInterview(data: { interviewId: string }) {
    return this.client.patch<Interview, { interviewId: string }>(
      `/interview/start/${data.interviewId}`,
    );
  }

  submitAnswer(data: SubmitAnswerRequest) {
    return this.client.post<SubmitAnswerResponse, SubmitAnswerRequest>(
      "/interview/submit-answer",
      data,
    );
  }

  getInterview(data: { interviewId: string }) {
    return this.client.get<Interview>(
      `/interview/get-interview/${data.interviewId}/`,
    );
  }

  generateReport(data: GenerateReportRequest) {
    return this.client.post<GenerateReportResponse, GenerateReportRequest>(
      `/interview/generate-report/`,
      data,
    );
  }
}
