import { prisma } from "@interview.ai/db";
import { protectedProcedure } from "../trpc";

export const protectedCandidateProcedure = protectedProcedure.use(
  async ({ next, ctx }) => {
    const candidate = await prisma.candidate.findUniqueOrThrow({
      where: {
        userId: ctx.userId,
      },
    });
    return next({
      ctx: {
        ...ctx,
        candidateId: candidate.id,
      },
    });
  },
);
