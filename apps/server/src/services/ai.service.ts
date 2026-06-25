import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import {
  AnswerEvaluationSchema,
  InterviewQuestionsSchema,
  ResumeAnalysisSchema,
  type AnswerEvaluation,
  type InterviewQuestions,
  type ResumeAnalysis,
} from "@interview.ai/types";
import type { Question } from "@interview.ai/db/generated/prisma/client";

// // Service function to analyze PDF resume and return structured data
export const analyzeResume = async (
  fileBuffer: Buffer,
): Promise<ResumeAnalysis> => {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: ResumeAnalysisSchema }),

      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this resume and extract the key details in structured JSON format.",
            },
            {
              type: "file",
              data: fileBuffer,
              mediaType: "application/pdf",
            },
          ],
        },
      ],
    });

    const data = JSON.parse(text);
    const response = data as ResumeAnalysis;

    return response;
  } catch (error) {
    console.error("Error analyzing resume in AI service:", error);
    throw error;
  }
};

// Service function to generate interview questions based on resume and job role
export const generateInterviewQuestions = async ({
  resumeAnalysis,
  jobTitle,
  experience,
  interviewMode,
}: {
  resumeAnalysis?: ResumeAnalysis;
  jobTitle: string;
  experience: string;
  interviewMode: "Technical" | "HR";
}): Promise<InterviewQuestions> => {
  try {
    // Construct prompt with all relevant details
    const prompt = `You are an expert enterprise tech and HR recruiter. 
Generate exactly 5 interview questions tailored precisely to this candidate's profile and target job role.

--- CANDIDATE RESUME ANALYSIS ---
Name: ${resumeAnalysis?.name}
Email: ${resumeAnalysis?.email || "Not Provided"}
Professional Experience: ${resumeAnalysis?.experience}
Core Skills: ${resumeAnalysis?.skills ? resumeAnalysis.skills.join(", ") : "Not Provided"}
Featured Projects: ${resumeAnalysis?.projects?.map((p) => `${p.name}: ${p.description}`).join("; ") || "Not Provided"}
Education Matrix: ${resumeAnalysis?.education?.map((e) => `${e.degree} - ${e.institution} (${e.year})`).join("; ") || "Not Provided"}
Executive Summary: ${resumeAnalysis?.summary || "Not Provided"}

--- INTERVIEW CONFIGURATION ---
Target Job Title: ${jobTitle}
Required Experience Level: ${experience}
Interview Category Track: ${interviewMode} (Options: TECHNICAL or HR)

--- QUESTION COMPOSITION MATRIX ---
Generate exactly 5 sequential questions conforming to these strict tracks. Ensure each question text prompt is clear, direct, and under 15 words to optimize for natural verbal flow.

Question 1:
- Focus: Professional Introduction and background overview.
- Difficulty: EASY
- Category: Introduction

Question 2:
- Focus: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Core technical stack competency, syntax, and foundational architectures." : "Professional communication abilities, listening accuracy, and interpersonal clarity."}
- Difficulty: EASY
- Category: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Core Skills" : "Communication"}

Question 3:
- Focus: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Practical engineering execution regarding listed projects and infrastructure choices." : "Behavioral scenarios regarding corporate conflicts, execution ownership, or teamwork dynamics."}
- Difficulty: MEDIUM
- Category: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Project Deep Dive" : "Behavioral"}

Question 4:
- Focus: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Analytical troubleshooting, algorithmic strategy, or logical bug resolution patterns." : "Situational judgment criteria, operational prioritization under crunch, or team alignment."}
- Difficulty: MEDIUM
- Category: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Problem Solving" : "Situational"}

Question 5:
- Focus: ${interviewMode.toUpperCase() === "TECHNICAL" ? "Complex technical reasoning, system design scalability, or theoretical tradeoffs." : "Long-term professional ambition, culture match, alignment, and fast learning aptitude."}
- Difficulty: HARD
- Category: ${interviewMode.toUpperCase() === "TECHNICAL" ? "System Design" : "Cultural Fit"}

--- OUTPUT COMPLIANCE REGULATION ---
Return the payload strictly as a structured JSON object object matching the target database enums.

Expected JSON schema format:
{
  "questions": [
    {
      "question": "The string containing the question prompt text under 25 words",
      "type": "${interviewMode.toUpperCase() === "TECHNICAL" ? "TECHNICAL" : "HR"}",
      "category": "The categorization string based on the focus metrics above",
      "difficulty": "EASY" | "MEDIUM" | "HARD"
    }
  ]
}`;
    // Call AI service
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: InterviewQuestionsSchema }),
      prompt,
    });

    // Parse and validate JSON response
    const data = JSON.parse(text);
    const response: InterviewQuestions = InterviewQuestionsSchema.parse(data);

    return response;
  } catch (error) {
    console.error("Error generating interview questions in AI service:", error);
    throw error;
  }
};

export const evaluateAnswer = async (
  question: Question[],
): Promise<AnswerEvaluation> => {
  try {
    //Generate a prompt for evaluating the answers
    //     type Question = {
    //     id: string;
    //     category: string | null;
    //     difficulty: Difficulty;
    //     questionText: string;
    //     timeLimitSeconds: number;
    //     userAnswer: string | null;
    //     aiFeedback: string | null;
    //     questionScore: number;
    //     confidenceScore: number;
    //     communicationScore: number;
    //     correctnessScore: number;
    //     interviewId: string;
    //     createdAt: Date;
    //     updatedAt: Date;
    // }
    const prompt = `
You are an expert technical and HR interviewer. Your task is to evaluate the candidate's answers to the following questions.
For each question, compare the candidate's answer ('userAnswer') against the question text ('questionText').

Evaluate each answer based on:
1. Correctness: How technically or logically accurate is the answer relative to the question? (Score 0-10)
2. Communication: How clear, structured, and easy to understand is the explanation? (Score 0-10)
3. Confidence: How confident does the candidate sound in their answer? (Score 0-10)
4. Overall Question Score: An average/weighted representation of the answer's quality. (Score 0-10)
5. AI Feedback: Provide concise, constructive feedback pointing out strengths and specific areas for improvement, keep the feedback under 15 words strictly. Do not repeat the answer; focus purely on constructive feedback.

Here are the questions and the candidate's responses:
${question
  .map(
    (q, i) => `
    QuestionId : ${q.id}
      Question ${i + 1}:
      Category: ${q.category || "General"}
      Difficulty: ${q.difficulty}
      Question Text: ${q.questionText}
      Candidate Answer: ${q.userAnswer || "No answer provided."}
`,
  )
  .join("\n")}

Return a JSON array where each item corresponds to the evaluation of the respective question in the same order as provided above.
`;

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: AnswerEvaluationSchema }),
      prompt,
    });

    const data = JSON.parse(text);
    const response: AnswerEvaluation = AnswerEvaluationSchema.parse(data);

    return response;
  } catch (error) {
    console.error("Error evaluating answer in AI service:", error);
    throw error;
  }
};
