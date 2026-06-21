import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: [3, "Name must be at least 3 characters long"],
      max: [30, "Name must be at most 30 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
    },
    photoUrl: {
      type: String,
    },
    credits: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true },
);

export const User = model("User", UserSchema);
