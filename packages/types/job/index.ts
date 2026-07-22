import z from "zod";
import { JobStatus } from "../db";

export const CreateJobSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.nativeEnum(JobStatus),
  minExperienceYears: z.number(),
  maxExperienceYears: z.number().optional(),
});

export const GetJobSchema = z.object({
  jobId: z.string(),
});

export const UpdateJobSchema = CreateJobSchema.partial().extend({
  jobId: z.string(),
});
