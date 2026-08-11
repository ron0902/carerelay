import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return children;
}