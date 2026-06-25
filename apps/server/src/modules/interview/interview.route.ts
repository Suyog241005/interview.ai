import { Router } from "express";
import {
  getInterview,
  getReport,
  interviewQuestions,
  startInterview,
  submitAnswer,
} from "./interview.controller";
import { uploadAudio } from "../../middleware/multer.middleware";

export const interviewRouter = Router();

interviewRouter.post("/start", startInterview);
interviewRouter.post("/questions", interviewQuestions);
interviewRouter.get("/get-interview/:interviewId/:userId", getInterview);
interviewRouter.post("/submit-answer", submitAnswer);
interviewRouter.get("/get-report/:id", getReport);
