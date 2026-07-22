import z from "zod";
import { prisma } from "@interview.ai/db";
import { generateInviteCode } from "../../utils/invite-token";
import { protectedCompanyOwnerProcedure } from "../../middleware/owner";

export const inviteRecruiter = protectedCompanyOwnerProcedure
  .input(
    z.object({
      email: z.email(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { email } = input;
    const { companyId, userId } = ctx;

    const token = generateInviteCode();

    const inviteRecruiter = await prisma.recruiterInvitation.create({
      data: {
        email,
        token,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        company: {
          connect: {
            id: companyId,
            ownerId: userId,
          },
        },
      },
    });

    return { inviteRecruiter };
  });
