import { prisma } from "@interview.ai/db";
import { protectedCandidateProcedure } from "../../middleware/candidate";
import { TRPCError } from "@trpc/server";

export const getCandidate = protectedCandidateProcedure.query(
  async ({ ctx }) => {
    const candidate = await prisma.candidate.findUnique({
      where: {
        userId: ctx.userId,
        id: ctx.candidateId,
      },
    });
    if (!candidate) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Candidate not found",
      });
    }
    return candidate;
  },
);
