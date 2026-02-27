import { Routes, Route } from "react-router-dom";
import SplashScreen from "../pages/Splash/SplashScreen";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "../components/common/ProtectedRoute";

import InternRoutes from "../pages/Intern/InternRoutes";
import HRRoutes from "../pages/HR/HRRoutes";
import EvaluatorRoutes from "../pages/Evaluator/EvaluatorRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/intern/*"
        element={
          <ProtectedRoute role="Intern">
            <InternRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hr/*"
        element={
          <ProtectedRoute role="HR">
            <HRRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/evaluator/*"
        element={
          <ProtectedRoute role="Evaluator">
            <EvaluatorRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;