import { router, protectedProcedure } from "../../trpc";
import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";

export const candidateAuthRouter = router({
  becomeCandidate: protectedProcedure.mutation(async ({ ctx }) => {
    const existingCandidate = await prisma.candidate.findUnique({
      where: { userId: ctx.userId },
    });

    if (existingCandidate) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Candidate profile already initialized",
      });
    }

    const candidate = await prisma.candidate.create({
      data: {
        userId: ctx.userId,
      },
    });

    return { success: true, candidate };
  }),
});
