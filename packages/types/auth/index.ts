import z from "zod";
import type { User } from "../db";

export const CandidateSignupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
}); 

export const CandidateSigninSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type CandidateSignupRequest = z.infer<typeof CandidateSignupSchema>;
export type CandidateSigninRequest = z.infer<typeof CandidateSigninSchema>;

export type CandidateSignupResponse = {
  message: string;
  user: User;
  token: string;
};

export const RecruiterAuthSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters long"),
  email: z.email("Invalid email address"),
  photoUrl: z.string().optional(),
  companyName: z.string(),
});

export type RecruiterAuthRequest = z.infer<typeof RecruiterAuthSchema>;

export type RecruiterAuthResponse = {
  message: string;
  user: User;
  token: string;
};

export const CompanyAuthSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters long"),
  email: z.email("Invalid email address"),
  photoUrl: z.string().optional(),
  companyName: z.string(),
});

export type CompanyAuthRequest = z.infer<typeof CompanyAuthSchema>;

export type CompanyAuthResponse = {
  message: string;
  user: User;
  token: string;
};
