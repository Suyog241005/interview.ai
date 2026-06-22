import type { Request, Response } from "express";
import {
  evaluateAnswer,
  generateInterviewQuestions,
} from "../../services/ai.service";
import { prisma } from "@interview.ai/db";
import type { InterviewSession } from "@interview.ai/types";

export const interviewQuestions = async (req: Request, res: Response) => {
  try {
    const { values, resumeAnalysis, interviewId } = req.body;

    const aiResult = await generateInterviewQuestions({
      resumeAnalysis,
      jobTitle: values.jobTitle,
      experience: values.experience,
      interviewMode: values.interviewMode,
    });

    const questions = aiResult.questions;

    await prisma.question.createMany({
      data: questions.map((q) => ({
        questionText: q.question,
        interviewId,
        difficulty: q.difficulty,
        timeLimitSeconds: {
          EASY: 60,
          MEDIUM: 90,
          HARD: 120,
        }[q.difficulty],
        category: q.category || null,
      })),
    });

    const interviewQuestions = await prisma.question.findMany({
      where: {
        interviewId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const interviewSession: InterviewSession = {
      id: interviewId,
      questions: interviewQuestions,
    };

    return res.json(interviewSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate interview questions" });
  }
};

export const startInterview = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { interviewMode, role, experience } = req.body;

    const interview = await prisma.interview.create({
      data: {
        userId: userId!,
        interviewMode,
        role,
        experience,
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
    const { interviewId, questionId, answer, timeTaken } = req.body;

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

    const evaluatedAnswer = await evaluateAnswer(answeredQuestion);
    const finalQuestionData = await prisma.question.update({
      where: { id: questionId },
      data: {
        confidenceScore: evaluatedAnswer.confidenceScore,
        communicationScore: evaluatedAnswer.communicationScore,
        correctnessScore: evaluatedAnswer.correctnessScore,
        questionScore: evaluatedAnswer.questionScore,
        aiFeedback: evaluatedAnswer.aiFeedback,
      },
    });

    return res.json(finalQuestionData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit the answer" });
  }
};

export const getInterview = async (req: Request, res: Response) => {
  try {
    const { interviewId="cmqox71tl0000acsh68hvk1jx", userId="cmqnpkvia00006ush3cdnie56" } = req.params;

    if (!interviewId || typeof interviewId !== "string") {
      return res.status(400).json({ message: "Interview ID is required" });
    }

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "User ID is required" });
    }

    const interview = await prisma.interview.findUniqueOrThrow({
      where: {
        id: "cmqox71tl0000acsh68hvk1jx",
        userId,
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
