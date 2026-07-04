import type { GenerateReportRequest } from "@interview.ai/types/interview/types";
import { api } from "@inteview.ai/api";
import { useMutation } from "@tanstack/react-query";

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: (data: GenerateReportRequest) =>
      api.interview.generateReport(data),
  });
};
