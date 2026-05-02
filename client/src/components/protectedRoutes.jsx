import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, role, allowedRole, children }) => {
  if (!user) {
    return <Navigate to="/candidate-login" />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;