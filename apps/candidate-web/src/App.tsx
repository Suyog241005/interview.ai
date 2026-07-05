import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/Home";
import AuthPage from "./pages/Auth";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "./jotai/atoms";
import InterviewPage from "./pages/Interview";
import { useGetUser } from "@interview.ai/query";
import { Loader2Icon } from "lucide-react";
import InterviewHistoryPage from "./pages/InterviewHistory";

function App() {
  const [user, setUser] = useAtom(userAtom);
  const { data, isLoading } = useGetUser();

  const currentUser = user || data?.user;

  useEffect(() => {
    if (data) {
      setUser(data.user);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/auth"
        element={currentUser ? <Navigate to={"/"} replace /> : <AuthPage />}
      />
      <Route
        path="/interview"
        element={currentUser ? <InterviewPage /> : <Navigate to={"/auth"} replace />}
      />
      <Route
        path="/history"
        element={currentUser ? <InterviewHistoryPage /> : <Navigate to={"/auth"} replace />}
      />
    </Routes>
  );
}

export default App;
