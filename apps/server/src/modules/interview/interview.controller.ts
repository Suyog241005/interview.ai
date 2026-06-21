import type { Request, Response } from "express";
import { generateInterviewQuestions } from "../../services/ai.service";

export const interviewQuestions = async (req: Request, res: Response) => {
  try {
    const { values, resumeAnalysis } = req.body;

    const questions = await generateInterviewQuestions({
      resumeAnalysis,
      jobTitle: values.jobTitle,
      experience: values.experience,
      interviewType: values.mode,
    });
    console.log(questions);

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate interview questions" });
  }
};
