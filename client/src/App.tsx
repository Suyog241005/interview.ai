import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/Home";
import AuthPage from "./pages/Auth";
import { useEffect } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom } from "./jotai/atoms";

function App() {
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.log("No active user session");
      }
    };
    getUser();
  }, [setUser]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
    </Routes>
  );
}

export default App;
