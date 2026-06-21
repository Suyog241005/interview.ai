import type { Request, Response } from "express";
import { generateInterviewQuestions } from "../../services/ai.service";
import { prisma } from "@interview.ai/db";

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
      })),
    });

    const interviewQuestions = await prisma.question.findMany({
      where: {
        interviewId,
      },
    });

    return res.json(interviewQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate interview questions" });
  }
};

export const startInterview = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { interviewMode } = req.body;

    const interview = await prisma.interview.create({
      data: {
        userId: userId!,
        interviewMode,
      },
    });
    return res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to start the interview" });
  }
};
