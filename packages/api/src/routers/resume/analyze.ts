import { AnalyzeResumeSchema } from "@interview.ai/types/resume";
import { protectedCandidateProcedure } from "../../middleware/candidate";
import { analyzeResume as aiResumeAnalyzer } from "../../services/ai.service";
import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";
import fs from "fs";

export const analyzeResume = protectedCandidateProcedure
  .input(AnalyzeResumeSchema)
  .mutation(async ({ input, ctx }) => {
    const { resumeId } = input;
    const { candidateId } = ctx;

    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        candidateId,
      },
      include: {
        resumeAnalysis: true,
      },
    });
    if (!resume) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Resume not found",
      });
    }
    if (resume.resumeAnalysis) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Resume already analyzed",
      });
    }

    const fileBuffer = fs.readFileSync(resume.fileUrl);

    const aiResponse = await aiResumeAnalyzer(fileBuffer);

    if (!aiResponse) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to analyze resume ",
      });
    }

    const {
      name,
      email,
      skills,
      projects,
      experienceyears,
      education,
      suggestedRoles,
      summary,
    } = aiResponse;

    const resumeAnalysis = await prisma.resumeAnalysis.create({
      data: {
        name,
        email,
        skills,
        projects,
        experienceyears,
        education,
        suggestedRoles,
        summary,
        resumeId,
      },
    });

    if (!resumeAnalysis) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create resume analysis",
      });
    }

    return { resumeAnalysis };
  });
