import { InviteCandidateSchema } from "@interview.ai/types/company";
import { protectedRecruiterProcedure } from "../../middleware/recruiter";
import { generateInviteCode } from "../../utils/invite-token";
import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";

export const inviteCandidate = protectedRecruiterProcedure
  .input(InviteCandidateSchema)
  .mutation(async ({ input, ctx }) => {
    const { candidateEmail, candidateName, jobId, interviewId } = input;
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

    const token = generateInviteCode(16);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        user: {
          email: candidateEmail,
        },
      },
    });

    const invitation = await prisma.invitation.create({
      data: {
        token,
        candidateEmail,
        candidateName,
        jobId,
        interviewId,
        expiresAt,
        candidateId: existingCandidate?.id ?? null,
      },
    });

    return { invitation };
  });
