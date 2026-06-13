import { model, Schema } from "mongoose";

const ResumeAnalysisSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  resumeAnalysis: {
    skills: [String],
    projects: [
      {
        name: String,
        description: String,
        techStack: [String],
      },
    ],
    experienceYears: Number,
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    suggestedRoles: [String],
    summary: String,
  },
});

export const ResumeAnalysis = model("ResumeAnalysis", ResumeAnalysisSchema);
