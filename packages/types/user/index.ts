import type { User } from "../db";

export type GetUserResponse = {
  message: string;
  user: User;
};
