import { Routes, Route, Navigate } from "react-router";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import { useAuth } from "./hooks/useAuth";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/signup" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
