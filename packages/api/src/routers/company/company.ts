import {
  CreateCompanySchema,
  UpdateCompanySchema,
} from "@interview.ai/types/company";
import { protectedProcedure } from "../../trpc";
import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";
import { protectedRecruiterProcedure } from "../../middleware/recruiter";
import { protectedCompanyOwnerProcedure } from "../../middleware/owner";

const createCompany = protectedProcedure
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

    const company = await prisma.$transaction(async (tx) => {
      const co = await tx.company.create({
        data: {
          name: companyName,
          website,
          logoUrl,
          ownerId: userId,
        },
      });

      await tx.recruiter.create({
        data: {
          userId,
          companyId: co.id,
        },
      });
      return co;
    });

    return { company };
  });

const deleteCompany = protectedCompanyOwnerProcedure.mutation(
  async ({ ctx }) => {
    const { companyId, userId } = ctx;

    const company = await prisma.company.delete({
      where: {
        id: companyId,
        ownerId: userId,
      },
    });

    return { company };
  },
);

const getCompany = protectedRecruiterProcedure.query(async ({ ctx }) => {
  const { companyId } = ctx;

  const company = await prisma.company.findUniqueOrThrow({
    where: {
      id: companyId,
    },
    include: {
      recruiters: true,
      jobs: true,
    },
  });

  return { company };
});

const updateCompany = protectedCompanyOwnerProcedure
  .input(UpdateCompanySchema.omit({ companyId: true }))
  .mutation(async ({ input, ctx }) => {
    const { companyName, website, logoUrl } = input;
    const { companyId, userId } = ctx;

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

export const companyProcedures = {
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany,
};
