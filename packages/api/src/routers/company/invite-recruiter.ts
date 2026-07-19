import z from "zod";
import { prisma } from "@interview.ai/db";
import { generateInviteCode } from "../../utils/invite-token";
import { protectedRecruiterProcedure } from "../../middleware/recruiter";

export const inviteRecruiter = protectedRecruiterProcedure
  .input(
    z.object({
      email: z.email(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { email } = input;
    const { recruiterId, companyId } = ctx;

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
            ownerId: recruiterId,
          },
        },
      },
    });

    //send email to the recruiter with the token
    // await sendEmail({
    //   to: email,
    //   subject: "You have been invited to join a company",
    //   text: `You have been invited to join a company. Click the link below to accept the invitation.
    //     ${process.env.NEXT_PUBLIC_BASE_URL}/auth/recruiter/signup?token=${inviteRecruiter.token}`,
    // });

    return { inviteRecruiter };
  });
