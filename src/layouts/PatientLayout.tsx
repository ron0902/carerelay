import { Outlet } from "react-router-dom";
import PatientSidebar from "../components/patient/PatientSidebar";

export default function PatientLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 lg:flex-row">
      <PatientSidebar />

      <main className="flex-1 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}