import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactElement;
  allowedRoles?: string[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const destination =
      user.role === "Admin"
        ? "/dashboard"
        : user.role === "Caregiver"
          ? "/user/dashboard"
          : user.role === "Patient"
            ? "/patient/dashboard"
            : user.role === "Organization"
              ? "/organization/dashboard"
            : "/login";

    return <Navigate to={destination} replace />;
  }

  // Logged in
  return children;
}