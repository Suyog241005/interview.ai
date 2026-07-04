import { Router } from "express";
import {
  getInterview,
  generateReport,
  interviewQuestions,
  createInterview,
  submitAnswer,
  startInterview,
} from "./interview.controller";

export const interviewRouter = Router();

interviewRouter.post("/create", createInterview);
interviewRouter.patch("/start/:id", startInterview);
interviewRouter.post("/questions", interviewQuestions);
interviewRouter.get("/get-interview/:interviewId", getInterview);
interviewRouter.post("/submit-answer", submitAnswer);
interviewRouter.post("/generate-report", generateReport);
