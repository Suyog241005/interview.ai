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
export const AnswerEvaluationSchema = z.array(
  z.object({
    id: z.string().describe("Question's Id"),
    userAnswer: z.string().describe("User's answer to the question"),
    confidenceScore: z.number().describe("Confidence Score of the answer"),
    communicationScore: z
      .number()
      .describe("Communication Score of the answer"),
    correctnessScore: z.number().describe("Correctness Score of the answer"),
    questionScore: z.number().describe("Question Score of the answer"),
    aiFeedback: z
      .string()
      .describe("Concise interview feedback. Maximum 15 words."),
  }),
);
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

export type InterviewWithQuestion = Interview & {
  questions: Question[];
};

//InterviewSession
export const DUMMY_INTERVIEW_DATA: InterviewWithQuestion = {
  id: "cmqtmnxmw0006jnsh38e1h7lx",
  status: "PENDING",
  score: 0,
  role: "Full Stack Developer",
  experience: "2 years",
  interviewMode: "video",
  userId: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
  questions: [
    {
      id: "cmqtmo3fx0007jnsh2gpg4z2r",
      questionText:
        "Tell me about yourself and your experience in full-stack development.",
      userAnswer: null,
      aiFeedback: null,
      questionScore: 0,
      category: "Introduction",
      difficulty: "EASY",
      interviewId: "cmqtmnxmw0006jnsh38e1h7lx",
      createdAt: new Date("2026-06-25 14:59:05.709"),
      updatedAt: new Date("2026-06-25 14:59:05.709"),
      communicationScore: 0,
      confidenceScore: 0,
      correctnessScore: 0,
      timeLimitSeconds: 60,
    },
    {
      id: "cmqtmo3fx0008jnshzxy0lfze",
      questionText:
        "Describe your experience with common front-end and back-end technologies.",
      userAnswer: null,
      aiFeedback: null,
      questionScore: 0,
      category: "Core Skills",
      difficulty: "EASY",
      interviewId: "cmqtmnxmw0006jnsh38e1h7lx",
      createdAt: new Date("2026-06-25 14:59:05.709"),
      updatedAt: new Date("2026-06-25 14:59:05.709"),
      communicationScore: 0,
      confidenceScore: 0,
      correctnessScore: 0,
      timeLimitSeconds: 60,
    },
    {
      id: "cmqtmo3fx0009jnsh8oy4rzo9",
      questionText:
        "Walk me through a full-stack project you've worked on recently.",
      userAnswer: null,
      aiFeedback: null,
      questionScore: 0,
      category: "Project Deep Dive",
      difficulty: "MEDIUM",
      interviewId: "cmqtmnxmw0006jnsh38e1h7lx",
      createdAt: new Date("2026-06-25 14:59:05.709"),
      updatedAt: new Date("2026-06-25 14:59:05.709"),
      communicationScore: 0,
      confidenceScore: 0,
      correctnessScore: 0,
      timeLimitSeconds: 90,
    },
    {
      id: "cmqtmo3fx000ajnsh7qiucemq",
      questionText:
        "How would you debug a common performance issue in a web application?",
      userAnswer: null,
      aiFeedback: null,
      questionScore: 0,
      category: "Problem Solving",
      difficulty: "MEDIUM",
      interviewId: "cmqtmnxmw0006jnsh38e1h7lx",
      createdAt: new Date("2026-06-25 14:59:05.709"),
      updatedAt: new Date("2026-06-25 14:59:05.709"),
      communicationScore: 0,
      confidenceScore: 0,
      correctnessScore: 0,
      timeLimitSeconds: 90,
    },
    {
      id: "cmqtmo3fx000bjnshsuwew99l",
      questionText:
        "How would you design a scalable microservices architecture for a new application?",
      userAnswer: null,
      aiFeedback: null,
      questionScore: 0,
      category: "System Design",
      difficulty: "HARD",
      interviewId: "cmqtmnxmw0006jnsh38e1h7lx",
      createdAt: new Date("2026-06-25 14:59:05.709"),
      updatedAt: new Date("2026-06-25 14:59:05.709"),
      communicationScore: 0,
      confidenceScore: 0,
      correctnessScore: 0,
      timeLimitSeconds: 120,
    },
  ],
};
