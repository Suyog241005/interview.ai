import { api } from "@inteview.ai/api";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["get-user"],
    queryFn: async () => (await api.user.getUser()).data,
  });
};
