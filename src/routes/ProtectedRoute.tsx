import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "../layouts/DashboardLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import UIShowcasePage from "../pages/ui/UIShowcasePage";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

<Routes>
  <Route path="/ui" element={<UIShowcasePage />} />

  <Route element={<AuthLayout />}>
    ...
  </Route>

  <Route
    element={
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route path="/dashboard" element={<DashboardPage />} />
  </Route>  
</Routes>     