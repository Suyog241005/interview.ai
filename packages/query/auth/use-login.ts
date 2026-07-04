import type { AuthRequest } from "@interview.ai/types";
import { api } from "@inteview.ai/api";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: AuthRequest) => api.auth.login(data),
  });
};
