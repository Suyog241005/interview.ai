import { router, protectedProcedure } from "../../trpc";
import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const recruiterAuthRouter = router({
  acceptInvitation: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const invitation = await prisma.recruiterInvitation.findUnique({
        where: { token: input.token },
      });

      if (
        !invitation ||
        invitation.status !== "PENDING" ||
        invitation.expiresAt < new Date()
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired token",
        });
      }

      if (invitation.email !== ctx.session.user.email) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Email mismatch" });
      }

      return await prisma.$transaction(async (tx) => {
        const recruiter = await tx.recruiter.create({
          data: {
            userId: ctx.userId,
            companyId: invitation.companyId,
          },
        });

        await tx.recruiterInvitation.update({
          where: { token: invitation.token },
          data: { status: "ACCEPTED" },
        });

        return recruiter;
      });
    }),
});
