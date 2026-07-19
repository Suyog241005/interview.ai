import { GetCompanySchema } from "@interview.ai/types/company";
import { protectedProcedure } from "../../trpc";
import { prisma } from "@interview.ai/db";

export const getCompany = protectedProcedure
  .input(GetCompanySchema)
  .query(async ({ input, ctx }) => {
    const { companyId } = input;
    const { userId } = ctx;

    const company = await prisma.company.findUniqueOrThrow({
      where: {
        id: companyId,
        ownerId: userId,
      },
      include: {
        recruiters: true,
        jobs: true,
      },
    });

    return { company };
  });
