import mongoose, { Schema } from "mongoose";

const InterviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    questions: {
      type: [String],
      required: true,
    },
    answers: {
      type: [String],
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Interview = mongoose.model("Interview", InterviewSchema);
