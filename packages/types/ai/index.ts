import z from "zod";
import { Difficulty } from "../db";
// Zod Schema for structured interview questions
export const CreatePracticeInterviewQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        questionText: z.string().describe("The actual interview question"),
        difficulty: z
          .enum(Difficulty, {
            error: "Difficulty must be EASY, MEDIUM, or HARD",
          })
          .describe("Difficulty level of the question"),
        category: z.string().optional().describe("Category of the question"),
        timeLimitSeconds: z
          .number()
          .describe("Time limit in seconds for the question"),
        displayOrder: z.number().describe("Order of the question"),
      }),
    )
    .describe("List of interview questions"),
});
export type CreatePracticeInterviewQuestions = z.infer<
  typeof CreatePracticeInterviewQuestionsSchema
>;

// //Zod schema for evaluating the answers
// export const AnswerEvaluationSchema = z.array(
//   z.object({
//     id: z.string().describe("Question's Id"),
//     userAnswer: z.string().describe("User's answer to the question"),
//     confidenceScore: z.number().describe("Confidence Score of the answer"),
//     communicationScore: z
//       .number()
//       .describe("Communication Score of the answer"),
//     correctnessScore: z.number().describe("Correctness Score of the answer"),
//     questionScore: z.number().describe("Question Score of the answer"),
//     aiFeedback: z
//       .string()
//       .describe("Concise interview feedback. Maximum 15 words."),
//   }),
// );
// export type AnswerEvaluation = z.infer<typeof AnswerEvaluationSchema>;

export const GenerateAiResultForPracticeInterviewSchema = z.object({
  overallScore: z.number().describe("Overall score of the interview"),
  strengths: z.array(z.string()).describe("Strengths of the candidate"),
  weaknesses: z.array(z.string()).describe("Weaknesses of the candidate"),
  summary: z.string().describe("Summary of the interview"),
  recommendation: z.string().describe("Recommendation for the candidate"),
});
export type GenerateAiResultForPracticeInterview = z.infer<
  typeof GenerateAiResultForPracticeInterviewSchema
>;
