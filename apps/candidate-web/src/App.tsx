import { useEffect } from "react";
import { trpc } from "@interview.ai/api/client";
import { Loader2Icon } from "lucide-react";
import { Routes, Route, Navigate } from "react-router";
import AuthPage from "./pages/Auth";
import InterviewPage from "./pages/Interview";
import InterviewHistoryPage from "./pages/InterviewHistory";
import HomePage from "./pages/Home";

function App() {
  const {
    data: candidate,
    isLoading,
    error,
    refetch,
  } = trpc.candidate.getCandidate.useQuery(undefined, {
    retry: false,
  });

  const becomeCandidate = trpc.candidateAuth.becomeCandidate.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (
      error?.data?.code === "NOT_FOUND" &&
      !becomeCandidate.isPending &&
      !becomeCandidate.isSuccess
    ) {
      becomeCandidate.mutate();
    }
  }, [error]);

  if (isLoading || becomeCandidate.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2Icon className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/auth"
        element={!candidate ? <AuthPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/interview"
        element={
          candidate ? <InterviewPage /> : <Navigate to="/auth" replace />
        }
      />
      <Route
        path="/history"
        element={
          candidate ? <InterviewHistoryPage /> : <Navigate to="/auth" replace />
        }
      />
    </Routes>
  );
}

export default App;
