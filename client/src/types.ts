import z from "zod";

export type userType = {
  _id: string;
  name: string;
  email: string;
  photoUrl?: string;
  credits: number;
};

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