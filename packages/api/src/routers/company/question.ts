import z from "zod";
import { protectedRecruiterProcedure } from "../../middleware/recruiter";
import { prisma } from "@interview.ai/db";
import { TRPCError } from "@trpc/server";
import { Difficulty } from "@interview.ai/types/db";
import { generateCompanyInterviewQuestions } from "../../services/ai.service";

const difficultyValues = Object.values(Difficulty) as [
  Difficulty,
  ...Difficulty[],
];

const getQuestions = protectedRecruiterProcedure
  .input(z.object({ interviewId: z.string() }))
  .query(async ({ input, ctx }) => {
    const { interviewId } = input;
    const { companyId } = ctx;

    const interview = await prisma.companyInterview.findFirst({
      where: {
        id: interviewId,
        job: { companyId },
      },
    });

    if (!interview) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Interview not found or access denied.",
      });
    }

    const questions = await prisma.companyQuestion.findMany({
      where: { interviewId },
      orderBy: { displayOrder: "asc" },
    });

    return { questions };
  });

const createQuestion = protectedRecruiterProcedure
  .input(
    z.object({
      interviewId: z.string(),
      questionText: z.string(),
      difficulty: z.enum(difficultyValues).default("EASY"),
      timeLimitSeconds: z.number().default(60),
      category: z.string().optional(),
      displayOrder: z.number(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const {
      interviewId,
      questionText,
      difficulty,
      timeLimitSeconds,
      category,
      displayOrder,
    } = input;
    const { companyId } = ctx;

    const interview = await prisma.companyInterview.findFirst({
      where: {
        id: interviewId,
        job: { companyId },
      },
    });

    if (!interview) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Interview not found or access denied.",
      });
    }

    const question = await prisma.companyQuestion.create({
      data: {
        interviewId,
        questionText,
        difficulty,
        timeLimitSeconds,
        category,
        displayOrder,
      },
    });

    return { question };
  });

const updateQuestion = protectedRecruiterProcedure
  .input(
    z.object({
      questionId: z.string(),
      questionText: z.string().optional(),
      difficulty: z.enum(difficultyValues).optional(),
      timeLimitSeconds: z.number().optional(),
      category: z.string().optional(),
      displayOrder: z.number().optional(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { questionId, ...data } = input;
    const { companyId } = ctx;

    const existing = await prisma.companyQuestion.findFirst({
      where: {
        id: questionId,
        interview: { job: { companyId } },
      },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Question not found or access denied.",
      });
    }

    const question = await prisma.companyQuestion.update({
      where: { id: questionId },
      data,
    });

    return { question };
  });

const deleteQuestion = protectedRecruiterProcedure
  .input(z.object({ questionId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { questionId } = input;
    const { companyId } = ctx;

    const existing = await prisma.companyQuestion.findFirst({
      where: {
        id: questionId,
        interview: { job: { companyId } },
      },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Question not found or access denied.",
      });
    }

    const question = await prisma.companyQuestion.delete({
      where: { id: questionId },
    });

    return { question };
  });

const generateAiQuestions = protectedRecruiterProcedure
  .input(z.object({ interviewId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { interviewId } = input;
    const { companyId } = ctx;

    const interview = await prisma.companyInterview.findFirst({
      where: {
        id: interviewId,
        job: { companyId },
      },
      include: {
        job: {
          include: {
            interviewConfig: true,
          },
        },
      },
    });

    if (!interview || !interview.job) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Interview or Job config not found.",
      });
    }

    const config = interview.job.interviewConfig;
    const generated = await generateCompanyInterviewQuestions({
      jobTitle: interview.job.title,
      jobDescription: interview.job.description,
      experienceYears: interview.job.minExperienceYears,
      interviewMode: config?.interviewMode ?? "TECHNICAL",
      questionCount: config?.questionCount ?? 5,
      promptText: config?.prompt,
    });

    await prisma.companyQuestion.deleteMany({ where: { interviewId } });

    const createdQuestions = await prisma.$transaction(
      generated.questions.map((q, idx) =>
        prisma.companyQuestion.create({
          data: {
            interviewId,
            questionText: q.questionText,
            difficulty: q.difficulty as Difficulty,
            category: q.category,
            timeLimitSeconds: q.timeLimitSeconds || 60,
            displayOrder: q.displayOrder || idx + 1,
          },
        }),
      ),
    );

    return { questions: createdQuestions };
  });

export const questionProcedures = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  generateAiQuestions,
};
