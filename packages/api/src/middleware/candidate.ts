import { prisma } from "@interview.ai/db";
import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const protectedCandidateProcedure = protectedProcedure.use(
  async ({ next, ctx }) => {
    const candidate = await prisma.candidate.findUnique({
      where: {
        userId: ctx.userId,
      },
    });
    if (!candidate) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Candidate profile not found",
      });
    }
    return next({
      ctx: {
        ...ctx,
        candidateId: candidate.id,
      },
    });
  },
);
