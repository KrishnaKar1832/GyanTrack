import { Routes, Route } from "react-router-dom";
import InternDashboard from "./InternDashboard";
import UpcomingTests from "./UpcomingTests";
import PreviousTests from "./PreviousTests";
import PerformanceMatrix from "./PerformanceMatrix";
import Profile from "./Profile";
import TestPage from "../Test/TestPage";
import TestResult from "./TestResult";

const InternRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InternDashboard />} />
      <Route path="upcoming" element={<UpcomingTests />} />
      <Route path="previous" element={<PreviousTests />} />
      <Route path="performance" element={<PerformanceMatrix />} />
      <Route path="profile" element={<Profile />} />
      <Route path="test/:id" element={<TestPage />} />
      <Route path="test-result/:id" element={<TestResult />} />
    </Routes>
  );
};

export default InternRoutes;