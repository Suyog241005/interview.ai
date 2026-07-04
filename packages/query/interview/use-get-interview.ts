import { api } from "@inteview.ai/api";
import { useQuery } from "@tanstack/react-query";

export const useGetInterview = (data: {
  interviewId: string;
}) => {
  return useQuery({
    queryKey: ["get-interview"],
    queryFn: () => api.interview.getInterview(data),
  });
};
