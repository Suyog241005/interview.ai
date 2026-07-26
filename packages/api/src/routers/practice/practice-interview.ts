import { prisma } from "@interview.ai/db";
import {
  CreatePracticeInterviewQuestionsSchema,
  GetPracticeInterviewSchema,
  StartPracticeInterviewSchema,
  CreatePracticeInterviewSchema,
  SubmitAnswerSchema,
  GeneratePracticeInterviewReportSchema,
} from "@interview.ai/types/interview";
import { router } from "../../trpc";
import { protectedCandidateProcedure } from "../../middleware/candidate";
import {
  generatePracticeInterviewQuestions,
  generatePracticeInterviewReport,
} from "../../services/ai.service";
import { TRPCError } from "@trpc/server";

export const practiceInterviewRouter = router({
  createPracticeInterview: protectedCandidateProcedure
    .input(CreatePracticeInterviewSchema)
    .mutation(async ({ input, ctx }) => {
      const { role, interviewMode, experienceYears, resumeId } = input;
      const candidateId = ctx.candidateId;
      if (resumeId) {
        const resume = await prisma.resume.findUnique({
          where: { id: resumeId, candidateId },
        });
        if (!resume) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Resume not found",
          });
        }
      }
      const practiceInterview = await prisma.practiceInterview.create({
        data: {
          candidateId,
          role,
          interviewMode,
          experienceYears,
          resumeId,
        },
      });
      return { practiceInterview };
    }),

  getPracticeInterview: protectedCandidateProcedure
    .input(GetPracticeInterviewSchema)
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const candidateId = ctx.candidateId;
      const practiceInterview = await prisma.practiceInterview.findUnique({
        where: { id, candidateId },
      });
      if (!practiceInterview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Practice interview not found",
        });
      }
      return { practiceInterview };
    }),

  createPracticeInterviewQuestions: protectedCandidateProcedure
    .input(CreatePracticeInterviewQuestionsSchema)
    .mutation(async ({ input, ctx }) => {
      const { practiceinterviewId, resumeAnalysis, values } = input;
      const candidateId = ctx.candidateId;

      const practiceInterview =
        await prisma.practiceInterview.findUniqueOrThrow({
          where: {
            id: practiceinterviewId,
            candidateId,
          },
        });

      const aiResult = await generatePracticeInterviewQuestions({
        role: values.role,
        resumeAnalysis,
        interviewMode: values.interviewMode,
        experience: values.experienceYears,
      });

      const { questions } = aiResult;

      await prisma.practiceQuestion.createMany({
        data: questions.map((q) => ({
          questionText: q.questionText,
          difficulty: q.difficulty,
          category: q.category,
          timeLimitSeconds: q.timeLimitSeconds,
          displayOrder: q.displayOrder,
          interviewId: practiceInterview.id,
        })),
      });

      const practiceInterviewWithQuestions =
        await prisma.practiceInterview.findUniqueOrThrow({
          where: { id: practiceinterviewId, candidateId },
          include: {
            questions: true,
          },
        });
      return { practiceInterviewWithQuestions };
    }),

  startPracticeInterview: protectedCandidateProcedure
    .input(StartPracticeInterviewSchema)
    .mutation(async ({ input, ctx }) => {
      const { practiceinterviewId } = input;
      const candidateId = ctx.candidateId;

      const practiceInterview =
        await prisma.practiceInterview.findUniqueOrThrow({
          where: {
            id: practiceinterviewId,
            candidateId,
          },
          include: {
            questions: true,
          },
        });
      if (practiceInterview.questions.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No questions found for this practice interview",
        });
      }
      const updatedPracticeInterview = await prisma.practiceInterview.update({
        where: {
          id: practiceinterviewId,
          candidateId,
        },
        data: {
          status: "IN_PROGRESS",
        },
      });
      return { practiceInterview: updatedPracticeInterview };
    }),

  submitAnswer: protectedCandidateProcedure
    .input(SubmitAnswerSchema)
    .mutation(async ({ input, ctx }) => {
      const { interviewId, questionId, userAnswer } = input;
      const candidateId = ctx.candidateId;

      const interview = await prisma.practiceInterview.findUniqueOrThrow({
        where: {
          id: interviewId,
          candidateId,
        },
        include: {
          questions: true,
        },
      });

      if (interview.status !== "IN_PROGRESS") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Interview is not in progress",
        });
      }

      // Check if question exists and belongs to this interview
      const questionExists = interview.questions.some(
        (q) => q.id === questionId,
      );
      if (!questionExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found for this interview",
        });
      }

      // Submit the answer
      const question = await prisma.practiceQuestion.update({
        where: {
          id: questionId,
          interviewId,
        },
        data: {
          userAnswer,
          isAnswered: true,
        },
      });

      return { question };
    }),

  generatePracticeInterviewReport: protectedCandidateProcedure
    .input(GeneratePracticeInterviewReportSchema)
    .mutation(async ({ input, ctx }) => {
      const { practiceinterviewId } = input;
      const candidateId = ctx.candidateId;

      const practiceInterview =
        await prisma.practiceInterview.findUniqueOrThrow({
          where: {
            id: practiceinterviewId,
            candidateId,
          },
          include: {
            questions: true,
          },
        });

      const aiResult = await generatePracticeInterviewReport(practiceInterview);

      const { overallScore, strengths, weaknesses, summary, recommendation } =
        aiResult;

      const updatedPracticeInterview = await prisma.practiceInterview.update({
        where: {
          id: practiceinterviewId,
          candidateId,
        },
        data: {
          status: "COMPLETED",
          report: {
            create: {
              overallScore,
              strengths,
              weaknesses,
              summary,
              recommendation,
            },
          },
        },
        include: {
          questions: true,
          report: true,
        },
      });

      return { practiceInterview: updatedPracticeInterview };
    }),

  getPracticeInterviewHistory: protectedCandidateProcedure.query(
    async ({ ctx }) => {
      const { candidateId } = ctx;
      const history = await prisma.practiceInterview.findMany({
        where: { candidateId },
        include: {
          questions: true,
          report: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return { history };
    },
  ),
});
