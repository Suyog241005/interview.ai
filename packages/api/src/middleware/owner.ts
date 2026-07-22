import { prisma } from "@interview.ai/db";
import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const protectedCompanyOwnerProcedure = protectedProcedure.use(
  async ({ next, ctx }) => {
    const company = await prisma.company.findUnique({
      where: {
        ownerId: ctx.userId,
      },
    });

    if (!company) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not the owner of any company",
      });
    }

    return next({
      ctx: {
        ...ctx,
        companyId: company.id,
      },
    });
  },
);
