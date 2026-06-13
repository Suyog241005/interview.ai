import { Router } from "express";
import { upload } from "../../middleware/multer.middleware";
import { analyzeResumeController } from "./resume-analysis.controller";

export const resumeAnalysisRouter = Router();

resumeAnalysisRouter.post(
  "/analyze",
  upload.single("resume"),
  analyzeResumeController,
);
