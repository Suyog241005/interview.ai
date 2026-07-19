import { UpdateCompanySchema } from "@interview.ai/types/company";
import { protectedProcedure } from "../../trpc";
import { prisma } from "@interview.ai/db";

export const updateCompany = protectedProcedure
  .input(UpdateCompanySchema)
  .mutation(async ({ input, ctx }) => {
    const { companyId, companyName, website, logoUrl } = input;
    const { userId } = ctx;

    const company = await prisma.company.update({
      where: {
        id: companyId,
        ownerId: userId,
      },
      data: {
        name: companyName,
        website,
        logoUrl,
      },
    });

    return { company };
  });
