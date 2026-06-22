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
  resumeAnalysis: ResumeAnalysis;
  jobTitle: string;
  experience: string;
  interviewMode: "Technical" | "HR";
}): Promise<InterviewQuestions> => {
  try {
    // Construct prompt with all relevant details
    const prompt = `You are an expert enterprise tech and HR recruiter. 
Generate exactly 5 interview questions tailored precisely to this candidate's profile and target job role.

--- CANDIDATE RESUME ANALYSIS ---
Name: ${resumeAnalysis.name}
Email: ${resumeAnalysis.email || "Not Provided"}
Professional Experience: ${resumeAnalysis.experience}
Core Skills: ${resumeAnalysis.skills ? resumeAnalysis.skills.join(", ") : "Not Provided"}
Featured Projects: ${resumeAnalysis.projects?.map((p) => `${p.name}: ${p.description}`).join("; ") || "Not Provided"}
Education Matrix: ${resumeAnalysis.education?.map((e) => `${e.degree} - ${e.institution} (${e.year})`).join("; ") || "Not Provided"}
Executive Summary: ${resumeAnalysis.summary || "Not Provided"}

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
  question: Question,
): Promise<AnswerEvaluation> => {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: AnswerEvaluationSchema }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
              You are an expert technical or hr interviewer according to question. Evaluate the user's response critically based on the question's difficulty and category if provided.
              Task: Analyze the user's answer text. Score confidence, communication, and technical/situational correctness on a 0-10 scale.
              Provide feedback accordingly to the following schema:
              {
                "userAnswer": "The answer provided by the user",
                "confidenceScore": 0-10,
                "communicationScore": 0-10,
                "correctnessScore": 0-10,
                "questionScore": 0-10,
                "aiFeedback": "Constructive feedback for improvement"
              }
              `,
            },
            {
              type: "text",
              text: `Question: ${question.questionText}`,
            },
            {
              type: "text",
              text: `Answer: ${question.userAnswer}`,
            },
            {
              type: "text",
              text: `Difficulty: ${question.difficulty}`,
            },
            {
              type: "text",
              text: `Category: ${question.category}`,
            },
          ],
        },
      ],
    });

    const data = JSON.parse(text);
    const response: AnswerEvaluation = AnswerEvaluationSchema.parse(data);

    return response;
  } catch (error) {
    console.error("Error evaluating answer in AI service:", error);
    throw error;
  }
};
