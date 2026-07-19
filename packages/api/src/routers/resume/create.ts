import { CreateResumeSchema } from "@interview.ai/types/resume";
import { protectedCandidateProcedure } from "../../middleware/candidate";
import { prisma } from "@interview.ai/db";

export const createResume = protectedCandidateProcedure
  .input(CreateResumeSchema)
  .mutation(async ({ input, ctx }) => {
    const { name, resumeUrl } = input;
    const { candidateId } = ctx;
    const resume = await prisma.resume.create({
      data: {
        fileName: name,
        fileUrl: resumeUrl,
        candidateId,
      },
    });

    return { resume };
  });
