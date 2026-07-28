import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { trpc, createTrpcClient } from "@interview.ai/api/client";
import { ThemeProvider } from "@/components/theme-provider";

function getApiUrl(): string {
  const isProd = import.meta.env.PROD || import.meta.env.MODE === "production";
  if (isProd) {
    return (
      import.meta.env.VITE_PROD_API_URL ||
      (typeof window !== "undefined" ? window.location.origin : "")
    );
  }
  return (
    import.meta.env.VITE_DEV_API_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:3001"
  );
}

function Root() {
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
    <BrowserRouter>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <ThemeProvider defaultTheme="dark" storageKey="interview-ai-theme">
              <App />
            </ThemeProvider>
          </JotaiProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
