import { DeleteCompanySchema } from "@interview.ai/types/company";
import { protectedProcedure } from "../../trpc";
import { prisma } from "@interview.ai/db";

export const deleteCompany = protectedProcedure
  .input(DeleteCompanySchema)
  .mutation(async ({ input, ctx }) => {
    const { companyId } = input;
    const { userId } = ctx;

    const company = await prisma.company.delete({
      where: {
        id: companyId,
        ownerId: userId,
      },
    });

    return { company };
  });
