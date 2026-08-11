import {
  Bell,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Home,
  LogOut,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    name: "Dashboard",
    path: "/patient/dashboard",
    icon: Home,
  },
  {
    name: "Appointments",
    path: "/patient/appointments",
    icon: CalendarDays,
  },
  {
    name: "My Caregiver",
    path: "/patient/caregiver",
    icon: User,
  },
  {
    name: "Care Plan",
    path: "/patient/care-plan",
    icon: ClipboardList,
  },
  {
    name: "Notifications",
    path: "/patient/notifications",
    icon: Bell,
  },
  {
    name: "My Profile",
    path: "/patient/profile",
    icon: User,
  },
];

export default function PatientSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex w-full flex-col bg-slate-800 text-white lg:min-h-screen lg:w-64">
      {/* Brand */}
      <div className="border-b border-slate-700 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500 p-2">
            <HeartPulse size={24} />
          </div>

          <div>
            <h1 className="text-lg font-bold">
              CareRelay
            </h1>

            <p className="text-xs text-slate-400">
              Patient Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut size={20} />

          <span className="font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}