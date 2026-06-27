import type { Request, Response } from "express";
import {
  evaluateAnswer,
  generateInterviewQuestions,
} from "../../services/ai.service";
import { prisma } from "@interview.ai/db";
import type { InterviewWithQuestion, Question } from "@interview.ai/types";
import fs from "fs";

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

    if (!interviewId) {
      return res.status(400).json({ message: "InterviewId not found" });
    }

    if (!questionId) {
      return res.status(400).json({ message: "questionId not found" });
    }

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
    const { interviewId, userId } = req.params;
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

export const getReport = async (req: Request, res: Response) => {
  try {
    const params = req.params;

    const id = params.id as string;

    if (!id) {
      return res.status(400).json({ message: "Interview Id is required" });
    }

    const questions = await prisma.question.findMany({
      where: {
        interviewId: id,
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

    await prisma.interview.update({
      where: {
        id,
      },
      data: {
        score: avgScore,
        status: "COMPLETED",
      },
    });

    const report = {
      id,
      questions: finalQuestions,
    };

    return res.json(report);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to retrieve interview report. Please try again.",
    });
  }
};
