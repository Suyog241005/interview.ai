import type { APIClient } from "./api-client";
import { type GetUserResponse } from "@interview.ai/types/user";

export class UserAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  getUser() {
    return this.client.get<GetUserResponse>("/user");
  }
}
