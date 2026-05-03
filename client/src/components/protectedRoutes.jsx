import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, role, allowedRole, children }) => {
  // 🔴 Not logged in
  if (!user) {
    return <Navigate to="/candidate-login" replace />;
  }

  // 🔴 Role mismatch
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;