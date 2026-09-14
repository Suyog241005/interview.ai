import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";
import {
  GetCompanyInterviewById,
  InvitationTokenSchema,
  SubmitAnswerSchema,
} from "@interview.ai/types/interview";
import { publicProcedure, router } from "../../trpc";
import { protectedCandidateProcedure } from "../../middleware/candidate";
import { generatePracticeInterviewReport, questionEvaluations } from "../../services/ai.service";

/**
 * Candidate side of a company assessment.
 * Recruiters build a candidate-less "template" CompanyInterview per job (see company.createInterview);
 * redeeming an invitation clones it into a per-candidate interview so the template stays reusable.
 */

const invitationByToken = async (token: string) =>
  prisma.invitation.findUnique({
    where: { token },
    include: {
      job: { include: { company: true, interviewConfig: true } },
      interview: { include: { questions: true } },
    },
  });

const assertUsable = (
  inv: NonNullable<Awaited<ReturnType<typeof invitationByToken>>>,
) => {
  if (inv.status === "PENDING" && inv.expiresAt < new Date()) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "This invitation has expired" });
  }
  if (!inv.interview || inv.interview.questions.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The recruiter has not configured questions for this interview yet",
    });
  }
};

const getInvitation = publicProcedure
  .input(InvitationTokenSchema)
  .query(async ({ input }) => {
    const inv = await invitationByToken(input.token);
    if (!inv) throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found" });
    return {
      invitation: {
        status: inv.status,
        expiresAt: inv.expiresAt,
        candidateEmail: inv.candidateEmail,
        candidateName: inv.candidateName,
        jobTitle: inv.job.title,
        companyName: inv.job.company.name,
        interviewMode: inv.job.interviewConfig?.interviewMode ?? "TECHNICAL",
        questionCount: inv.interview?.questions.length ?? 0,
      },
    };
  });

const redeemInvitation = protectedCandidateProcedure
  .input(InvitationTokenSchema)
  .mutation(async ({ input, ctx }) => {
    const inv = await invitationByToken(input.token);
    if (!inv) throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found" });

    if (inv.candidateEmail.toLowerCase() !== ctx.session.user.email.toLowerCase()) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This invitation was sent to ${inv.candidateEmail}. Sign in with that email.`,
      });
    }

    // Already redeemed by this candidate: return their interview (page refresh, resume)
    if (inv.status === "ACCEPTED") {
      if (inv.candidateId !== ctx.candidateId || !inv.interviewId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Invitation already used" });
      }
      const interview = await prisma.companyInterview.findUniqueOrThrow({
        where: { id: inv.interviewId, candidateId: ctx.candidateId },
        include: { questions: { orderBy: { displayOrder: "asc" } }, report: true },
      });
      return { interview, jobTitle: inv.job.title, interviewMode: inv.job.interviewConfig?.interviewMode ?? "TECHNICAL" };
    }
    if (inv.status !== "PENDING") {
      throw new TRPCError({ code: "BAD_REQUEST", message: `Invitation is ${inv.status.toLowerCase()}` });
    }
    assertUsable(inv);
    const template = inv.interview!;

    const interview = await prisma.$transaction(async (tx) => {
      const created = await tx.companyInterview.create({
        data: {
          jobId: inv.jobId,
          candidateId: ctx.candidateId,
          questions: {
            create: template.questions.map((q) => ({
              questionText: q.questionText,
              difficulty: q.difficulty,
              timeLimitSeconds: q.timeLimitSeconds,
              category: q.category,
              displayOrder: q.displayOrder,
            })),
          },
        },
        include: { questions: { orderBy: { displayOrder: "asc" } }, report: true },
      });
      await tx.invitation.update({
        where: { id: inv.id },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
          candidateId: ctx.candidateId,
          interviewId: created.id,
        },
      });
      return created;
    });

    return { interview, jobTitle: inv.job.title, interviewMode: inv.job.interviewConfig?.interviewMode ?? "TECHNICAL" };
  });

const ownInterview = async (interviewId: string, candidateId: string, status: "PENDING" | "IN_PROGRESS") => {
  const interview = await prisma.companyInterview.findFirst({
    where: { id: interviewId, candidateId, status },
  });
  if (!interview) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Interview not found or not ${status.toLowerCase().replace("_", " ")}`,
    });
  }
  return interview;
};

const start = protectedCandidateProcedure
  .input(GetCompanyInterviewById)
  .mutation(async ({ input, ctx }) => {
    await ownInterview(input.interviewId, ctx.candidateId, "PENDING");
    const interview = await prisma.companyInterview.update({
      where: { id: input.interviewId },
      data: { status: "IN_PROGRESS", startedAt: new Date() },
    });
    return { interview };
  });

const submitAnswer = protectedCandidateProcedure
  .input(SubmitAnswerSchema)
  .mutation(async ({ input, ctx }) => {
    const { interviewId, questionId, userAnswer } = input;
    await ownInterview(interviewId, ctx.candidateId, "IN_PROGRESS");
    const question = await prisma.companyQuestion.update({
      where: { id: questionId, interviewId },
      data: { userAnswer, isAnswered: true },
    });
    return { question };
  });

const generateReport = protectedCandidateProcedure
  .input(GetCompanyInterviewById)
  .mutation(async ({ input, ctx }) => {
    const interview = await prisma.companyInterview.findFirst({
      where: { id: input.interviewId, candidateId: ctx.candidateId, status: "IN_PROGRESS" },
      include: {
        questions: { orderBy: { displayOrder: "asc" } },
        job: { include: { interviewConfig: true } },
      },
    });
    if (!interview) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Interview not found or not in progress" });
    }

    const ai = await generatePracticeInterviewReport({
      interviewMode: interview.job?.interviewConfig?.interviewMode ?? "TECHNICAL",
      role: interview.job?.title ?? "Candidate",
      experienceYears: interview.job?.minExperienceYears ?? 0,
      questions: interview.questions,
    });

    const updated = await prisma.$transaction(async (tx) => {
      for (const q of questionEvaluations(interview.questions, ai.questions)) {
        await tx.companyQuestion.update({ where: { id: q.questionId }, data: q.data });
      }
      return tx.companyInterview.update({
        where: { id: interview.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          report: {
            create: {
              overallScore: ai.overallScore,
              strengths: ai.strengths,
              weaknesses: ai.weaknesses,
              summary: ai.summary,
              recommendation: ai.recommendation,
            },
          },
        },
        include: { questions: { orderBy: { displayOrder: "asc" } }, report: true },
      });
    });

    return { interview: updated };
  });

export const companyInterviewRouter = router({
  getInvitation,
  redeemInvitation,
  start,
  submitAnswer,
  generateReport,
});
