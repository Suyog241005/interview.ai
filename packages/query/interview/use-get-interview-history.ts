
import { api } from "@inteview.ai/api";
import { useQuery } from "@tanstack/react-query";

export const useGetInterviewHistory = () => {
  return useQuery({
    queryKey: ["interview-history"],
    queryFn: async () => (await api.interview.getInterviewHistory()).data,
  });
};
