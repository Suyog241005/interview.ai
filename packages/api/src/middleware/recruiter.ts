import { prisma } from "@interview.ai/db";
import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const protectedRecruiterProcedure = protectedProcedure.use(
  async ({ next, ctx }) => {
    const recruiter = await prisma.recruiter.findUnique({
      where: {
        userId: ctx.userId,
      },
    });
    if (!recruiter) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Recruiter profile not found",
      });
    }
    return next({
      ctx: {
        ...ctx,
        recruiterId: recruiter.id,
        companyId: recruiter.companyId,
      },
    });
  },
);
