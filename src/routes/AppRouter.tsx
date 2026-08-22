import { Routes, Route, Navigate } from "react-router-dom";
import CaregiversPage from "../pages/caregivers/CaregiversPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyOTPPage from "../pages/auth/VerifyOTPPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import NotFoundPage from "../pages/errors/NotFoundPage";
import UIShowcasePage from "../pages/ui/UIShowcasePage";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import PatientsPage from "../pages/patients/PatientsPage";
import OrganizationsPage from "../pages/organizations/OrganizationsPage";
import AssignmentsPage from "../pages/assignments/AssignmentsPage";
import PatientLayout from "../layouts/PatientLayout";
import PatientDashboardPage from "../pages/patient/PatientDashboardPage";
import PatientAppointmentsPage from "../pages/patient/PatientAppointmentsPage";
import PatientCaregiverPage from "../pages/patient/PatientCaregiverPage";
import PatientCarePlanPage from "../pages/patient/PatientCarePlanPage";
import PatientNotificationsPage from "../pages/patient/PatientNotificationsPage";
import PatientProfilePage from "../pages/patient/PatientProfilePage";
import UserLayout from "../layouts/UserLayout";
import UserDashboardPage from "../pages/user/UserDashboardPage";
import ShiftOffersPage from "../pages/user/ShiftOffersPage";
import AvailabilityPage from "../pages/user/AvailabilityPage";
import UserProfilePage from "../pages/user/UserProfilePage";
import MyShiftsPage from "../pages/user/MyShiftsPage";
import MySchedulePage from "../pages/user/MySchedulePage";
import NotificationsPage from "../pages/user/NotificationsPage";
import AppointmentsPage from "../pages/appointments/AppointmentsPage";
import ReportsPage from "../pages/reports/ReportsPage";
import CarePlansPage from "../pages/carePlans/CarePlansPage";

export default function AppRouter() {
 return (
  <Routes>
    {/* Auth */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Route>

    <Route path="/ui" element={<UIShowcasePage />} />

    {/* Admin */}
    <Route
      element={
        <ProtectedRoute allowedRoles={["Admin"]}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="/caregivers" element={<CaregiversPage />} />
      <Route path="/organizations" element={<OrganizationsPage />} />
      <Route path="/assignments" element={<AssignmentsPage />} />
      <Route path="/care-plans" element={<CarePlansPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
    </Route>

    {/* Caregiver */}
    <Route
      element={
        <ProtectedRoute allowedRoles={["Caregiver"]}>
          <UserLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/user/dashboard" element={<UserDashboardPage />} />
      <Route path="/user/shifts" element={<MyShiftsPage />} />
      <Route path="/user/availability" element={<AvailabilityPage />} />
      <Route path="/user/offers" element={<ShiftOffersPage />} />
      <Route path="/user/profile" element={<UserProfilePage />} />
      <Route path="/user/schedule" element={<MySchedulePage />} />
      <Route path="/user/notifications" element={<NotificationsPage />} />
    </Route>

    {/* Patient */}
    <Route
      element={
        <ProtectedRoute allowedRoles={["Patient"]}>
          <PatientLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
      <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
      <Route path="/patient/caregiver" element={<PatientCaregiverPage />} />
      <Route path="/patient/care-plan" element={<PatientCarePlanPage />} />
      <Route path="/patient/notifications" element={<PatientNotificationsPage />} />
      <Route path="/patient/profile" element={<PatientProfilePage />} />
    </Route>

    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
}