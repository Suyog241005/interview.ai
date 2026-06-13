import type { Request, Response } from "express";
import fs from "fs";
import { analyzeResume } from "../../services/ai.service";
import { ResumeAnalysis } from "./resume-analysis.model";

export const analyzeResumeController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const filepath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filepath);

    const resumeAnalysis = await analyzeResume(fileBuffer);

    const resume = await ResumeAnalysis.create({
      userId: req.userId,
      resumeAnalysis: resumeAnalysis,
    });

    fs.unlinkSync(filepath);

    return res.json(resume);
  } catch (error) {
    console.error(error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ message: "Failed to analyze resume" });
  }
};
