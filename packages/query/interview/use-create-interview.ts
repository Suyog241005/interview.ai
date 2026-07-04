import type { CreateInterviewRequest } from "@interview.ai/types";
import { api } from "@inteview.ai/api";
import { useMutation } from "@tanstack/react-query";

export const useCreateInterview = () => {
  return useMutation({
    mutationFn: (data: CreateInterviewRequest) =>
      api.interview.createInterview(data),
  });
};
