import { api } from "@interview.ai/api";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
  return useMutation({
    mutationFn: () => api.auth.logout(),
  });
};
