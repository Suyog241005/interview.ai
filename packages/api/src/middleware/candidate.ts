import { prisma } from "@interview.ai/db";
import { protectedProcedure } from "../trpc";

/** Any signed-in user is a candidate; the row is created on first use. */
export const protectedCandidateProcedure = protectedProcedure.use(
  async ({ next, ctx }) => {
    const candidate = await prisma.candidate.upsert({
      where: { userId: ctx.userId },
      create: { userId: ctx.userId },
      update: {},
      select: { id: true },
    });
    return next({
      ctx: {
        ...ctx,
        candidateId: candidate.id,
      },
    });
  },
);
