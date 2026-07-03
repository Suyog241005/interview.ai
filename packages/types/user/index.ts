import type { User } from "../db/types";

export type GetUserResponse = {
  message: string;
  user: User;
};
