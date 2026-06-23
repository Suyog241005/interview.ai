import { Router } from "express";
import {
  getInterview,
  interviewQuestions,
  startInterview,
} from "./interview.controller";

export const interviewRouter = Router();

interviewRouter.post("/start", startInterview);
interviewRouter.post("/questions", interviewQuestions);
interviewRouter.get("/get-interview/:interviewId/:userId", getInterview);
