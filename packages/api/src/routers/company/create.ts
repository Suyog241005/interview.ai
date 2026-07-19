import { CreateCompanySchema } from "@interview.ai/types/company";
import { protectedProcedure } from "../../trpc";
import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";

export const createCompany = protectedProcedure
  .input(CreateCompanySchema)
  .mutation(async ({ input, ctx }) => {
    const { companyName, website, logoUrl } = input;
    const { userId } = ctx;

    const existingCompany = await prisma.company.findUnique({
      where: {
        name: companyName,
      },
    });

    if (existingCompany) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Company name already exists",
      });
    }

    const company = await prisma.company.create({
      data: {
        name: companyName,
        website,
        logoUrl,
        ownerId: userId,
      },
    });

    return { company };
  });
