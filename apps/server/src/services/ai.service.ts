import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import {
  InterviewQuestionsSchema,
  ResumeAnalysisSchema,
  type InterviewQuestions,
  type ResumeAnalysis,
} from "@interview.ai/types";

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
    const prompt = `
    You are an expert interviewer. Generate ${interviewMode} interview questions based on the following information:

    --- Resume Analysis ---
    Name: ${resumeAnalysis.name}
    ${resumeAnalysis.email ? `Email: ${resumeAnalysis.email}` : ""}
    Experience: ${resumeAnalysis.experience}
    Skills: ${resumeAnalysis.skills.join(", ")}
    Projects: ${resumeAnalysis.projects
      ?.map((p) => `${p.name} - ${p.description}`)
      .join("; ")}
    Education: ${resumeAnalysis.education
      ?.map((e) => `${e.degree} from ${e.institution} (${e.year})`)
      .join("; ")}
    Summary: ${resumeAnalysis.summary}

    --- Interview Details ---
    Target Job Role: ${jobTitle}
    Experience: ${experience}
    Interview Mode: ${interviewMode}

    Generate ${interviewMode === "Technical" ? "10-12" : "8-10"} ${interviewMode.toLowerCase()} questions that would be asked in a real interview for this profile.
    Include a mix of: 
    - ${interviewMode === "Technical" ? "introduce yourself, explain the projects you have worked on in detail, technical fundamentals, problem-solving, system design (if experienced), project-specific questions, and relevant technologies" : "introduce yourself, behavioral questions, communication skills, career goals, adaptability, and cultural fit"}
    
    Return the output strictly in JSON format matching the following schema:
    {
      "questions": [
        {
          "question": "The interview question text",
          "type": "Technical" | "HR",
          "category": "(optional) Category like Data Structures, SQL, Behavioral",
          "difficulty": "Easy | Medium | Hard"
        }
      ]
    }
  `;

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
