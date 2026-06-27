import express from "express";
import { CLIENT_URL, PORT } from "./constants";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { authRouter } from "./modules/auth/auth.route";
import { userRouter } from "./modules/user/user.route";
import { authMiddleware } from "./middleware/auth.middleware";
import { interviewRouter } from "./modules/interview/interview.route";
import { resumeAnalysisRouter } from "./modules/resume-analysis/resume-analysis.route";

const app = express();

app.use(express.json());

const allowedOrigins = [
  CLIENT_URL,
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || 
                        origin.endsWith(".vercel.app") ||
                        origin.startsWith("http://localhost:");
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

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

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
