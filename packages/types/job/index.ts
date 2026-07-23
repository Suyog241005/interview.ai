import z from "zod";
import { InterviewMode, JobStatus } from "../db";

const interviewModeValues = Object.values(InterviewMode) as [
  InterviewMode,
  ...InterviewMode[],
];
const jobStatusValues = Object.values(JobStatus) as [JobStatus, ...JobStatus[]];

export const CreateJobSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(jobStatusValues),
  minExperienceYears: z.number(),
  maxExperienceYears: z.number().optional(),
});

export const GetJobSchema = z.object({
  jobId: z.string(),
});

export const UpdateJobSchema = CreateJobSchema.partial().extend({
  jobId: z.string(),
});

export const UpsertInterviewConfigSchema = z.object({
  jobId: z.string(),
  questionCount: z.number().min(1).max(20).default(5),
  interviewMode: z.enum(interviewModeValues),
  durationMinutes: z.number().min(5).max(120).default(30),
  prompt: z.string().optional(),
});

export const GetInterviewConfigSchema = z.object({
  jobId: z.string(),
});
