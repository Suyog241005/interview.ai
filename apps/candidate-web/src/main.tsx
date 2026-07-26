import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { trpc, createTrpcClient } from "@interview.ai/api/client";

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

  const [trpcClient] = useState(() =>
    createTrpcClient(import.meta.env.VITE_API_URL || "http://localhost:3001"),
  );

  return (
    <BrowserRouter>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <App />
          </JotaiProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
