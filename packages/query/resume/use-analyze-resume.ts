import { api } from "@inteview.ai/api";
import { useMutation } from "@tanstack/react-query";

export const useAnalyzeResume = () => {
  return useMutation({
    mutationFn: (data: FormData) => api.resume.resumeAnalysis(data),
  });
};
