import { Router } from "express";
import { interviewQuestions } from "./interview.controller";

export const interviewRouter = Router();

interviewRouter.post("/questions", interviewQuestions);
