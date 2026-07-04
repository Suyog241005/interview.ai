import { api } from "@inteview.ai/api";
import type { SubmitAnswerRequest } from "@interview.ai/types/interview/types";
import { useMutation } from "@tanstack/react-query";

export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: (data: SubmitAnswerRequest) => api.interview.submitAnswer(data),
  });
};
