import type { Request, Response } from "express";
import {
  evaluateAnswer,
  generateInterviewQuestions,
} from "../../services/ai.service";
import { prisma } from "@interview.ai/db";
import {
  CreateInterviewSchema,
  type InterviewWithQuestion,
  type Question,
} from "@interview.ai/types";
import {
  GenerateReportRequestSchema,
  InterviewQuestionsRequestSchema,
  SubmitAnswerSchema,
} from "@interview.ai/types/interview/types";

export const createInterview = async (req: Request, res: Response) => {
  try {
    const { userId } = req;

    const { data, success, error } = CreateInterviewSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ message: "Invalid data", error });
    }
    const { interviewMode, role, experience } = data;

    const interview = await prisma.$transaction(
      async (tx) => {
        const user = await tx.user.findUnique({ where: { id: userId } });

        if (!user || user.credits < 50) {
          throw new Error("Insufficient credits");
        }

        const interview = await tx.interview.create({
          data: { userId: userId!, interviewMode, role, experience },
        });

        await tx.user.update({
          where: { id: userId },
          data: { credits: { decrement: 50 } },
        });

        return interview;
      },
      { maxWait: 10000, timeout: 30000 },
    );

    return res.status(200).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to start the interview" });
  }
};

export const interviewQuestions = async (req: Request, res: Response) => {
  try {
    const { data, success, error } = InterviewQuestionsRequestSchema.safeParse(
      req.body,
    );

    if (!success) {
      return res.status(400).json({ message: "Invalid data", error });
    }

    const { resumeAnalysis, values, interviewId } = data;

    const aiResult = await generateInterviewQuestions({
      resumeAnalysis,
      role: values.role,
      experience: values.experience,
      interviewMode: values.interviewMode,
    });

    const questions = aiResult.questions;

    await prisma.question.createMany({
      data: questions.map((q) => ({
        questionText: q.question,
        interviewId: interviewId,
        difficulty: q.difficulty,
        timeLimitSeconds: {
          EASY: 60,
          MEDIUM: 90,
          HARD: 120,
        }[q.difficulty],
        category: q.category || null,
      })),
    });

    const interviewWithQuestions = await prisma.interview.findUniqueOrThrow({
      where: {
        id: interviewId,
      },
      include: {
        questions: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const interviewSession: InterviewWithQuestion = interviewWithQuestions;

    return res.json(interviewSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate interview questions" });
  }
};

export const startInterview = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const interviewid = req.params.id as string;

    if (!interviewid) {
      return res.status(400).json({
        message: "Interview Id is required",
      });
    }

    const interview = await prisma.interview.update({
      where: {
        id: interviewid,
        userId: userId!,
      },
      data: {
        status: "IN_PROGRESS",
      },
    });
    return res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to start the interview" });
  }
};

export const submitAnswer = async (req: Request, res: Response) => {
  try {
    const { data, success, error } = SubmitAnswerSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ message: "Invalid data", error });
    }

    const { interviewId, questionId, answer, timeTaken } = data;

    let question = await prisma.question.findFirstOrThrow({
      where: {
        id: questionId,
        interviewId: interviewId,
      },
      include: {
        interview: true,
      },
    });

    if (!answer || answer.trim() === "") {
      const finalQuestionData = await prisma.question.update({
        where: { id: questionId },
        data: {
          aiFeedback: "No answer provided",
          confidenceScore: 0,
          communicationScore: 0,
          correctnessScore: 0,
          questionScore: 0,
        },
      });
      return res.json(finalQuestionData);
    }
    if (question.timeLimitSeconds && timeTaken > question.timeLimitSeconds) {
      const finalQuestionData = await prisma.question.update({
        where: { id: questionId },
        data: { aiFeedback: "Time limit exceeded", questionScore: 0 },
      });
      return res.json(finalQuestionData); // Fixed: Returns freshly updated object
    }

    const answeredQuestion = await prisma.question.update({
      where: { id: questionId },
      data: { userAnswer: answer },
    });

    // //todo testing
    // const finalQuestionData: Question = {
    //   category: "AI",
    //   difficulty: "EASY",
    //   userAnswer: answer,
    //   confidenceScore: 0,
    //   communicationScore: 0,
    //   correctnessScore: 0,
    //   questionScore: 0,
    //   aiFeedback: "Good",
    //   id: questionId,
    //   questionText: question.questionText,
    //   timeLimitSeconds: question.timeLimitSeconds!,
    //   interviewId: question.interviewId,
    //   createdAt: question.createdAt,
    //   updatedAt: question.updatedAt,
    // };

    return res.json(answeredQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit the answer" });
  }
};

export const getInterview = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { interviewId } = req.params;
    console.log(interviewId, "interviewId");
    console.log(userId, "userId");

    if (!interviewId || typeof interviewId !== "string") {
      return res.status(400).json({ message: "Interview ID is required" });
    }

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "User ID is required" });
    }

    const interview = await prisma.interview.findUniqueOrThrow({
      where: {
        id: interviewId,
        userId: userId,
      },
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    return res.json(interview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to retrieve interview data. Please try again.",
    });
  }
};

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { data, success, error } = GenerateReportRequestSchema.safeParse(
      req.body,
    );

    if (!success) {
      return res.status(400).json({ message: "Invalid data", error });
    }

    const { interviewId } = data;

    const questions = await prisma.question.findMany({
      where: {
        interviewId,
      },
    });

    console.log(questions);

    const answerEvaluation = await evaluateAnswer(questions);

    let finalQuestions: Question[] = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const item = answerEvaluation[i];
      if (item) {
        const updatedQuestion = await prisma.question.update({
          where: { id: q?.id },
          data: {
            confidenceScore: item.confidenceScore,
            communicationScore: item.communicationScore,
            correctnessScore: item.correctnessScore,
            questionScore: item.questionScore,
            aiFeedback: item.aiFeedback,
          },
        });
        finalQuestions.push(updatedQuestion);
      }
    }

    const avgScore =
      finalQuestions.reduce((acc, q) => acc + q.questionScore, 0) /
      finalQuestions.length;

    const interview = await prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        score: avgScore,
        status: "COMPLETED",
      },
      include: {
        questions: true,
      },
    });

    return res.json(interview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to retrieve interview report. Please try again.",
    });
  }
};

export const getInterviewHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const interview = await prisma.interview.findMany({
      where: {
        userId,
      },
      include: {
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!interview) {
      return res.status(404).json({
        message: "No interview found",
      });
    }

    return res.json(interview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch interview history. Please try again.",
    });
  }
};
