import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  user,
  children,
  allowedRoles = [],
  fallback = "/login",
}) {
  // 1️⃣ Not logged in
  if (!user) {
    return <Navigate to={fallback} replace />;
  }

  // Normalize role (VERY IMPORTANT)
  const userRole = user.role?.toUpperCase();

  // 2️⃣ Logged in but role not allowed
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.map((r) => r.toUpperCase()).includes(userRole)
  ) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Allowed
  return children;
}
