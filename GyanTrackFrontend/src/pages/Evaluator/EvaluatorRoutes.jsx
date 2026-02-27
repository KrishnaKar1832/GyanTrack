import { Routes, Route } from "react-router-dom";
import EvaluatorDashboard from "./EvaluatorDashboard";
import PendingSubmissions from "./PendingSubmissions";
import PerformanceMatrix from "./PerformanceMatrix";
import AssignedTemplates from "./AssignedTemplates";
import QuestionForm from "../Forms/QuestionForm";

const EvaluatorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EvaluatorDashboard />} />
      <Route path="submissions" element={<PendingSubmissions />} />
      <Route path="performance" element={<PerformanceMatrix />} />
      <Route path="templates" element={<AssignedTemplates />} />
      <Route path="forms/:id" element={<QuestionForm />} />
    </Routes>
  );
};

export default EvaluatorRoutes;