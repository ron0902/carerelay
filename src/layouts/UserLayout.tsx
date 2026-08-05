import { Outlet } from "react-router-dom";
import UserSidebar from "../components/user/UserSidebar";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <UserSidebar />

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}