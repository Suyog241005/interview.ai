import z from "zod";

// Zod Schema for structured resume analysis
export const ResumeAnalysisSchema = z.object({
  name: z.string().describe("Candidate's full name"),
  email: z.string().optional().describe("Candidate's email address"),
  skills: z
    .array(z.string())
    .describe("List of core technical and soft skills"),
  projects: z
    .array(
      z.object({
        name: z.string().describe("Project name"),
        description: z.string().describe("Project description"),
        techStack: z
          .array(z.string())
          .optional()
          .describe("Project tech stack"),
      }),
    )
    .optional()
    .describe("Projects worked on"),
  experience: z.string().describe("Experience of candidate"),
  education: z
    .array(
      z.object({
        degree: z
          .string()
          .describe("Degree name (e.g. B.S. in Computer Science)"),
        institution: z.string().describe("School or University name"),
        year: z.string().optional().describe("Graduation year"),
      }),
    )
    .describe("Education history"),
  suggestedRoles: z
    .array(z.string())
    .describe("Top 3 target job roles matching the resume profile"),
  summary: z
    .string()
    .describe("A brief 2-3 sentence professional summary of the candidate"),
});
export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;

// Zod Schema for structured interview questions
export const InterviewQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().describe("Interview question"),
        type: z.enum(["Technical", "HR"], {
          error: "Type must be Technical or HR",
        }),
        category: z
          .string()
          .optional()
          .describe("Category of the question (e.g. Data Structures, SQL)"),
        difficulty: z
          .enum(["EASY", "MEDIUM", "HARD"], {
            error: "Difficulty must be Easy, Medium, or Hard",
          })
          .describe("Difficulty level of the question"),
      }),
    )
    .describe("List of interview questions"),
});
export type InterviewQuestions = z.infer<typeof InterviewQuestionsSchema>;

//Zod schema for evaluating the answers
export const AnswerEvaluationSchema = z.object({
  userAnswer: z.string().describe("User's answer to the question"),
  confidenceScore: z.number().describe("Confidence Score of the answer"),
  communicationScore: z.number().describe("Communication Score of the answer"),
  correctnessScore: z.number().describe("Correctness Score of the answer"),
  questionScore: z.number().describe("Question Score of the answer"),
  aiFeedback: z.string().describe("AI Feedback of the answer"),
});
export type AnswerEvaluation = z.infer<typeof AnswerEvaluationSchema>;

type Question = {
  category: string | null;
  difficulty: string;
  userAnswer: string | null;
  confidenceScore: number;
  communicationScore: number;
  correctnessScore: number;
  questionScore: number;
  aiFeedback: string | null;
  id: string;
  questionText: string;
  timeLimitSeconds: number;
  interviewId: string;
  createdAt: Date;
  updatedAt: Date;
};
export { type Question };

export type InterviewSession = {
  id: string;
  questions: Question[];
};

export const DUMMY_INTERVIEW_SESSION: InterviewSession = {
  id: "session_12345",
  questions: [
    {
      id: "q_1",
      interviewId: "session_12345",
      questionText:
        "Can you tell me about yourself and your background in software development?",
      category: "Introduction",
      difficulty: "EASY",
      timeLimitSeconds: 60,
      userAnswer: null,
      confidenceScore: 0,
      communicationScore: 0,
      correctnessScore: 0,
      questionScore: 0,
      aiFeedback: null,
      createdAt: new Date("2026-06-22T10:00:00Z"),
      updatedAt: new Date("2026-06-22T10:01:00Z"),
    },
    {
      id: "q_2",
      interviewId: "session_12345",
      questionText:
        "What is the difference between virtual DOM and real DOM in React?",
      category: "Core Skills",
      difficulty: "EASY",
      timeLimitSeconds: 60,
      userAnswer: null,
      confidenceScore: 0,
      communicationScore: 0,
      correctnessScore: 0,
      questionScore: 0,
      aiFeedback: null,
      createdAt: new Date("2026-06-22T10:01:00Z"),
      updatedAt: new Date("2026-06-22T10:02:00Z"),
    },
    {
      id: "q_3",
      interviewId: "session_12345",
      questionText:
        "Describe a complex technical challenge you faced on a project and how you resolved it.",
      category: "Project Deep Dive",
      difficulty: "MEDIUM",
      timeLimitSeconds: 90,
      userAnswer: null,
      confidenceScore: 0,
      communicationScore: 0,
      correctnessScore: 0,
      questionScore: 0,
      aiFeedback: null,
      createdAt: new Date("2026-06-22T10:02:00Z"),
      updatedAt: new Date("2026-06-22T10:02:00Z"),
    },
  ],
};

// model Interview {
//   id            String          @id @default(cuid())
//   status        InterviewStatus @default(PENDING)
//   score         Int             @default(0)
//   role          String
//   experience    String
//   interviewMode InterviewMode

//   userId String
//   user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }

export type Interview = {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  score: number;
  role: string;
  experience: string;
  interviewMode: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
