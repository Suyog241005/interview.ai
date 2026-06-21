import { Router } from "express";
import { interviewQuestions, startInterview } from "./interview.controller";

export const interviewRouter = Router();

interviewRouter.post("/start", startInterview);
interviewRouter.post("/questions", interviewQuestions);
