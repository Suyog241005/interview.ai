import z from "zod";
import type { User } from "../db/types";

export const AuthSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters long"),
  email: z.email("Invalid email address"),
  photoUrl: z.string().optional(),
});

export type AuthRequest = z.infer<typeof AuthSchema>;

export type AuthResponse = {
  message: string;
  user: User;
  token: string;
};

export type LogoutResponse = {
  message: string;
};
