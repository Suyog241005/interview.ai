import {
  CreateJobSchema,
  GetJobSchema,
  UpdateJobSchema,
} from "@interview.ai/types/job";
import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";
import { protectedRecruiterProcedure } from "../../middleware/recruiter";

const createJob = protectedRecruiterProcedure
  .input(CreateJobSchema)
  .mutation(async ({ input, ctx }) => {
    const {
      title,
      description,
      status,
      minExperienceYears,
      maxExperienceYears,
    } = input;
    const { companyId, recruiterId } = ctx;

    const { job, jobRecruiter } = await prisma.$transaction(async (tx) => {
      const job = await tx.job.create({
        data: {
          title,
          description,
          status,
          minExperienceYears,
          maxExperienceYears,
          companyId,
        },
      });

      const jobRecruiter = await tx.jobRecruiter.create({
        data: {
          jobId: job.id,
          recruiterId,
        },
      });

      return { job, jobRecruiter };
    });

    return { job, jobRecruiter };
  });

const deleteJob = protectedRecruiterProcedure.mutation(async ({ ctx }) => {
  const { companyId, userId } = ctx;

  const company = await prisma.company.delete({
    where: {
      id: companyId,
      ownerId: userId,
    },
  });

  return { company };
});

const getJob = protectedRecruiterProcedure
  .input(GetJobSchema)
  .query(async ({ input, ctx }) => {
    const { jobId } = input;
    const { companyId } = ctx;

    const job = await prisma.job.findUniqueOrThrow({
      where: {
        id: jobId,
        companyId,
      },
      include: {
        jobRecruiters: true,
        company: true,
        interviewConfig: true,
      },
    });

    return { job };
  });

const updateJob = protectedRecruiterProcedure
  .input(UpdateJobSchema)
  .mutation(async ({ input, ctx }) => {
    const {
      jobId,
      title,
      description,
      status,
      minExperienceYears,
      maxExperienceYears,
    } = input;
    const { companyId, recruiterId } = ctx;

    const existingJob = await prisma.job.findFirst({
      where: {
        id: jobId,
        companyId,
        jobRecruiters: {
          some: {
            recruiterId,
          },
        },
      },
    });

    if (!existingJob) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to update this job.",
      });
    }

    const job = await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        title,
        description,
        status,
        minExperienceYears,
        maxExperienceYears,
      },
    });

    return { job };
  });

export const jobProcedures = {
  createJob,
  deleteJob,
  getJob,
  updateJob,
};
