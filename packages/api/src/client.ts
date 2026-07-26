import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./_app";

export const trpc = createTRPCReact<AppRouter>();

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
