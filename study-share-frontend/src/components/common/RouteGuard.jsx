import { Navigate } from "react-router-dom";

const RouteGuard = ({ user, children, allowedRoles = [], fallback = "/login" }) => {
  // Not logged in
  if (!user) return <Navigate to={fallback} replace />;

  // Role not allowed
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.some(
      (role) => role.toUpperCase() === user.role?.toUpperCase()
    )
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RouteGuard;
