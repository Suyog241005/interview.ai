import type z from "zod";

export type User = {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
};

export const InterviewModes = ["TECHNICAL", "HR"] as const;
export type InterviewMode = (typeof InterviewModes)[number];

export const InterviewStatuses = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
] as const;
export type InterviewStatus = z.infer<typeof InterviewStatuses>;

export type Interview = {
  id: string;
  status: InterviewStatus;
  score: number;
  role: string;
  experience: string;
  interviewMode: InterviewMode;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const Difficulties = ["EASY", "MEDIUM", "HARD"] as const;
export type Difficulty = (typeof Difficulties)[number];

export type Question = {
  id: string;
  questionText: string;
  difficulty: Difficulty;
  timeLimitSeconds: number;
  userAnswer: string | null;
  aiFeedback: string | null;
  questionScore: number;
  confidenceScore: number;
  communicationScore: number;
  correctnessScore: number;
  category: string | null;
  interviewId: string;
  createdAt: Date;
  updatedAt: Date;
};
