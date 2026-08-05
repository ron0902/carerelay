import { Outlet } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}