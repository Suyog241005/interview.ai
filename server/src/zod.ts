import { z } from "zod";

export const AuthSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters long"),
  email: z.email("Invalid email address"),
  photoUrl: z.string().optional(),
});

