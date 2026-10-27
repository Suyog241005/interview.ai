import express from "express";
import { PORT } from "./constants";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter, createTRPCContext } from "@interview.ai/api";
import { toNodeHandler } from "better-auth/node";
import { auth, isAllowedOrigin } from "@interview.ai/better-auth/server";

const app = express();

// CORS first so every route, including error responses and preflights, carries the headers
app.use(
  cors({
    // Reflect the caller's origin when the shared policy allows it (every origin by default).
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    maxAge: 86400,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Better Auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));

// tRPC API
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  }),
);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
