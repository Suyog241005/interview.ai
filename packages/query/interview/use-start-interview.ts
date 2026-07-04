import { api } from "@inteview.ai/api";
import { useMutation } from "@tanstack/react-query";

export const useStartInterview = () => {
  return useMutation({
    mutationFn: (data: { interviewId: string }) =>
      api.interview.startInterview(data),
  });
};
