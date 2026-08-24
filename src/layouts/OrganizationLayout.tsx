import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  UserCog,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/organization/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/organization/members", label: "Members", icon: Users },
  { to: "/organization/patients", label: "Patients", icon: Users },
  { to: "/organization/caregivers", label: "Caregivers", icon: UserCog },
  { to: "/organization/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/organization/notifications", label: "Notifications", icon: Bell },
];

export default function OrganizationLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex w-72 flex-col bg-blue-700 text-white shadow-xl">
        <div className="border-b border-blue-600 p-6">
          <h1 className="text-3xl font-bold">CareRelay</h1>
          <p className="mt-1 text-sm text-blue-100">Healthcare Management</p>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-6">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${isActive ? "bg-white text-blue-700 shadow-md" : "hover:bg-blue-600"}`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-blue-600 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-700">
              <Building2 size={22} />
            </div>
            <div>
              <p className="font-semibold">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-blue-100">Organization Admin</p>
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 transition hover:bg-blue-500">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b bg-white px-8 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Organization Portal</h1>
            <p className="text-sm text-gray-500">Manage your organization in CareRelay</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 font-bold text-white">
              {user?.first_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-500">Organization account</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
