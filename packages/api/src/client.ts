import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./_app";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const trpc = createTRPCReact<AppRouter>();

// 1. Export helper types derived directly from AppRouter
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
// 2. Specific type for Practice Interview with Questions
export type PracticeInterviewWithQuestion =
  RouterOutputs["practice"]["createPracticeInterviewQuestions"]["practiceInterviewWithQuestions"];
export type PracticeInterview = RouterOutputs["practice"]["getPracticeInterview"]["practiceInterview"];

export const createTrpcClient = (baseUrl = "http://localhost:3000") =>
  trpc.createClient({
    links: [
      httpBatchLink({
        url: `${baseUrl}/trpc`,
        fetch: (url, options) =>
          fetch(url as any, {
            ...options,
            credentials: "include", // Enables BetterAuth session cookie sending
          }) as any,
      }),
    ],
  });
