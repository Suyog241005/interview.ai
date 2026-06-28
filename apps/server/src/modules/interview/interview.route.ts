import { Router } from "express";
import {
  getInterview,
  getReport,
  interviewQuestions,
  createInterview,
  submitAnswer,
  startInterview,
} from "./interview.controller";

export const interviewRouter = Router();

interviewRouter.post("/create", createInterview);
interviewRouter.patch("/start/:id", startInterview);
interviewRouter.post("/questions", interviewQuestions);
interviewRouter.get("/get-interview/:interviewId/:userId", getInterview);
interviewRouter.post("/submit-answer", submitAnswer);
interviewRouter.get("/get-report/:id", getReport);
