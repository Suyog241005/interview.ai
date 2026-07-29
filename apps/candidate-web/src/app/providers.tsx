"use client";

import { useState } from "react";
import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, createTrpcClient } from "@interview.ai/api/client";
import { ThemeProvider } from "@/components/theme-provider";

function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_PROD_API_URL && process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_PROD_API_URL;
  }
  if (process.env.NEXT_PUBLIC_DEV_API_URL) {
    return process.env.NEXT_PUBLIC_DEV_API_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3001";
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  const [trpcClient] = useState(() => createTrpcClient(getApiUrl()));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <ThemeProvider defaultTheme="dark" storageKey="interview-ai-theme">
            {children}
          </ThemeProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
