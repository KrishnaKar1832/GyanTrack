import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  // role comparison is case-sensitive; backend sends "Admin", "Evaluator", "Intern"
  if (user.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;