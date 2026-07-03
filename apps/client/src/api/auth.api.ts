import type {
  AuthRequest,
  AuthResponse,
  LogoutResponse,
} from "@interview.ai/types";
import type { APIClient } from "./api-client";

export class AuthAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  login(data: AuthRequest) {
    return this.client.post<AuthResponse, AuthRequest>("/auth", data);
  }

  logout() {
    return this.client.post<LogoutResponse, undefined>("/auth/logout");
  }
}
