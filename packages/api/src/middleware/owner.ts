import { prisma } from "@interview.ai/db";
import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const protectedCompanyOwnerProcedure = protectedProcedure.use(
  async ({ next, ctx }) => {
    const companyOwner = await prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.userId,
      },
      include: {
        ownedCompany: true,
      },
    });

    if (!companyOwner.ownedCompany) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are not owner of any company",
      });
    }

    return next({
      ctx: {
        ...ctx,
        ownerId: companyOwner.id,
        companyId: companyOwner.ownedCompany.id,
      },
    });
  },
);
