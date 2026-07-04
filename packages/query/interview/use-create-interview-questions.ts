import { type InterviewQuestionsRequest } from "@interview.ai/types/interview/types";
import { api } from "@inteview.ai/api";
import { useMutation } from "@tanstack/react-query";

export const useCreateInterviewQuestions = () => {
  return useMutation({
    mutationFn: (data: InterviewQuestionsRequest) =>
      api.interview.interviewQuestions(data),
  });
};
