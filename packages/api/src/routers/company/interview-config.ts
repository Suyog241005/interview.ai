import {
  UpsertInterviewConfigSchema,
  GetInterviewConfigSchema,
} from "@interview.ai/types/job";
import { protectedRecruiterProcedure } from "../../middleware/recruiter";
import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";

const upsertInterviewConfig = protectedRecruiterProcedure
  .input(UpsertInterviewConfigSchema)
  .mutation(async ({ input, ctx }) => {
    const { jobId, questionCount, interviewMode, durationMinutes, prompt } =
      input;
    const { companyId } = ctx;

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        companyId,
      },
    });

    if (!job) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Job not found or access denied.",
      });
    }

    const config = await prisma.interviewConfig.upsert({
      where: {
        jobId,
      },
      create: {
        jobId,
        questionCount,
        interviewMode,
        durationMinutes,
        prompt,
      },
      update: {
        questionCount,
        interviewMode,
        durationMinutes,
        prompt,
      },
    });

    return { config };
  });

const getInterviewConfig = protectedRecruiterProcedure
  .input(GetInterviewConfigSchema)
  .query(async ({ input, ctx }) => {
    const { jobId } = input;
    const { companyId } = ctx;

    const config = await prisma.interviewConfig.findFirst({
      where: {
        jobId,
        job: {
          companyId,
        },
      },
    });

    return { config };
  });

export const interviewConfigProcedures = {
  upsertInterviewConfig,
  getInterviewConfig,
};
