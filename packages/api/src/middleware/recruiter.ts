import { prisma } from "@interview.ai/db";
import { protectedProcedure } from "../trpc";

export const protectedRecruiterProcedure = protectedProcedure.use(
  async ({ next, ctx }) => {
    const recruiter = await prisma.recruiter.findUniqueOrThrow({
      where: {
        userId: ctx.userId,
      },
    });
    return next({
      ctx: {
        ...ctx,
        recruiterId: recruiter.id,
        companyId: recruiter.companyId,
      },
    });
  },
);
