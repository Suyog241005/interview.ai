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

export const practiceInterviewRouter = router({
  createPracticeInterview: protectedCandidateProcedure
    .input(CreatePracticeInterviewSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { role, interviewMode, experienceYears, resumeId } = input;
        const candidateId = ctx.candidateId;
        if (resumeId) {
          const resume = await prisma.resume.findUnique({
            where: { id: resumeId, candidateId },
          });
          if (!resume) {
            return { error: "Resume not found" };
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
      } catch (error) {
        console.log(error);
        return { error };
      }
    }),

  getPracticeInterview: protectedCandidateProcedure
    .input(GetPracticeInterviewSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { id } = input;
        const candidateId = ctx.candidateId;
        const practiceInterview = await prisma.practiceInterview.findUnique({
          where: { id, candidateId },
        });
        if (!practiceInterview) {
          return { error: "Practice interview not found" };
        }
        return { practiceInterview };
      } catch (error) {
        console.log(error);
        return { error };
      }
    }),

  createPracticeInterviewQuestions: protectedCandidateProcedure
    .input(CreatePracticeInterviewQuestionsSchema)
    .mutation(async ({ input, ctx }) => {
      try {
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
      } catch (error) {
        console.log(error);
        return { error };
      }
    }),

  startPracticeInterview: protectedCandidateProcedure
    .input(StartPracticeInterviewSchema)
    .mutation(async ({ input, ctx }) => {
      try {
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
          return { error: "No questions found for this practice interview" };
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
      } catch (error) {
        console.error(error);
        return { error };
      }
    }),

  submitAnswer: protectedCandidateProcedure
    .input(SubmitAnswerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
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
          return { error: "Interview is not in progress" };
        }

        // Check if question exists and belongs to this interview
        const questionExists = interview.questions.some(
          (q) => q.id === questionId,
        );
        if (!questionExists) {
          return { error: "Question not found for this interview" };
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
      } catch (error) {
        console.error(error);
        return { error };
      }
    }),

  generatePracticeInterviewReport: protectedCandidateProcedure
    .input(GeneratePracticeInterviewReportSchema)
    .mutation(async ({ input, ctx }) => {
      try {
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

        const aiResult =
          await generatePracticeInterviewReport(practiceInterview);

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
      } catch (error) {
        console.error(error);
        return { error };
      }
    }),

  getPracticeInterviewHistory: protectedCandidateProcedure.query(
    async ({ ctx }) => {
      try {
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
      } catch (error) {
        console.error(error);
        return { error };
      }
    },
  ),
});
