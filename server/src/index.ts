import express from "express";
import { MONGO_URI, PORT } from "./constants";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { authRouter } from "./modules/auth/auth.route";
import mongoose from "mongoose";
import { userRouter } from "./modules/user/user.route";
import { authMiddleware } from "./middleware/auth.middleware";
import { askAi } from "./services/ai.service";
import { interviewRouter } from "./modules/interview/interview.route";
import { upload } from "./middleware/multer.middleware";
import { resumeAnalysisRouter } from "./modules/resume-analysis/resume-analysis.route";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

app.get("/api", (_req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", authMiddleware, userRouter);
app.use("/api/resume", authMiddleware, resumeAnalysisRouter);
app.use("/api/interview", authMiddleware, interviewRouter);

// Error handling

// app.use(fallbackHandler);
// app.use(errorHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("database connected");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("database connection failed");
  });
