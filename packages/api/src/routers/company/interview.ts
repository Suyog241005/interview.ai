import {
  CreateCompanyInterview,
  UpdateCompanyInterview,
} from "@interview.ai/types/interview";
import { protectedRecruiterProcedure } from "../../middleware/recruiter";
import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";
import { GetCompanyInterviewById } from "@interview.ai/types/interview";

const createInterview = protectedRecruiterProcedure
  .input(CreateCompanyInterview)
  .mutation(async ({ input, ctx }) => {
    const { startedAt, completedAt, candidateId, jobId } = input;
    const { recruiterId, companyId } = ctx;

    const jobAssignment = await prisma.job.findFirst({
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

    if (!jobAssignment) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Job not found or you are not assigned to this job.",
      });
    }

    const interview = await prisma.companyInterview.create({
      data: {
        startedAt,
        completedAt,
        candidateId,
        jobId,
      },
    });

    return { interview };
  });

const getAllCompanyInterviews = protectedRecruiterProcedure.query(
  async ({ ctx }) => {
    const { companyId } = ctx;

    const interviews = await prisma.companyInterview.findMany({
      where: {
        job: {
          companyId,
        },
      },
      include: {
        candidate: {
          include: {
            user: true,
          },
        },
        job: true,
      },
    });

    return { interviews };
  },
);

const getCompanyInterviewById = protectedRecruiterProcedure
  .input(GetCompanyInterviewById)
  .query(async ({ input, ctx }) => {
    const { companyId } = ctx;
    const { interviewId } = input;

    const interview = await prisma.companyInterview.findFirst({
      where: {
        id: interviewId,
        job: {
          companyId,
        },
      },
      include: {
        candidate: {
          include: {
            user: true,
          },
        },
        job: true,
        report: true,
        questions: true,
      },
    });

    if (!interview) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Interview not found",
      });
    }

    return { interview };
  });

const updateCompanyInterview = protectedRecruiterProcedure
  .input(UpdateCompanyInterview)
  .mutation(async ({ input, ctx }) => {
    const { companyId } = ctx;
    const { interviewId, startedAt, completedAt, candidateId, jobId } = input;

    const existing = await prisma.companyInterview.findFirst({
      where: {
        id: interviewId,
        job: {
          companyId,
        },
      },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Interview not found or access denied.",
      });
    }

    const interview = await prisma.companyInterview.update({
      where: {
        id: interviewId,
      },
      data: {
        startedAt,
        completedAt,
        candidateId,
        jobId,
      },
    });

    return { interview };
  });

const deleteCompanyInterview = protectedRecruiterProcedure
  .input(GetCompanyInterviewById)
  .mutation(async ({ input, ctx }) => {
    const { companyId } = ctx;
    const { interviewId } = input;

    const existing = await prisma.companyInterview.findFirst({
      where: {
        id: interviewId,
        job: {
          companyId,
        },
      },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Interview not found or access denied.",
      });
    }

    const interview = await prisma.companyInterview.delete({
      where: {
        id: interviewId,
      },
    });

    return { interview };
  });

export const interviewProcedures = {
  createInterview,
  getAllCompanyInterviews,
  getCompanyInterviewById,
  updateCompanyInterview,
  deleteCompanyInterview,
};
