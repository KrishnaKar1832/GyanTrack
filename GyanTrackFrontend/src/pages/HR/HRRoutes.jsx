import { Routes, Route } from "react-router-dom";
import HRDashboard from "./HRDashboard";
import PendingEvaluations from "./PendingEvaluations";
import PerformanceMatrix from "./PerformanceMatrix";
import AssignTemplate from "./AssignTemplate";
import RegisterUser from "./RegisterUser";

const HRRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HRDashboard />} />
      <Route path="pending" element={<PendingEvaluations />} />
      <Route path="performance" element={<PerformanceMatrix />} />
      <Route path="assign-template" element={<AssignTemplate />} />
      <Route path="register" element={<RegisterUser />} />
    </Routes>
  );
};

export default HRRoutes;