import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

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

// Service function to analyze PDF resume and return structured data
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
          .enum(["Easy", "Medium", "Hard"], {
            error: "Difficulty must be Easy, Medium, or Hard",
          })
          .optional()
          .describe("Difficulty level of the question"),
      }),
    )
    .describe("List of interview questions"),
});
export type InterviewQuestions = z.infer<typeof InterviewQuestionsSchema>;

// Service function to generate interview questions based on resume and job role
export const generateInterviewQuestions = async ({
  resumeAnalysis,
  jobTitle,
  experience,
  interviewType,
}: {
  resumeAnalysis: ResumeAnalysis;
  jobTitle: string;
  experience: string;
  interviewType: "Technical" | "HR";
}): Promise<InterviewQuestions> => {
  try {
    // Construct prompt with all relevant details
    const prompt = `
    You are an expert interviewer. Generate ${interviewType} interview questions based on the following information:

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
    Interview Type: ${interviewType}

    Generate ${interviewType === "Technical" ? "10-15" : "8-12"} ${interviewType.toLowerCase()} questions that would be asked in a real interview for this profile.
    Include a mix of: 
    - ${interviewType === "Technical" ? "introduce yourself, describe projects, technical fundamentals, problem-solving, system design (if experienced), project-specific questions, and relevant technologies" : "introduce yourself, behavioral questions, communication skills, career goals, adaptability, and cultural fit"}
    
    Return the output strictly in JSON format matching the following schema:
    {
      "questions": [
        {
          "question": "The interview question text",
          "type": "Technical" | "HR",
          "category": "(optional) Category like Data Structures, SQL, Behavioral",
          "difficulty": "(optional) Easy | Medium | Hard"
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
