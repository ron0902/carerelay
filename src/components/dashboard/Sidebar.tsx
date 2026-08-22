import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Building2,
  ClipboardList,
  ClipboardCheck,
  CalendarDays,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Patients",
    path: "/patients",
    icon: Users,
  },
  {
    name: "Caregivers",
    path: "/caregivers",
    icon: UserCog,
  },
  {
    name: "Organizations",
    path: "/organizations",
    icon: Building2,
  },
  {
    name: "Assignments",
    path: "/assignments",
    icon: ClipboardList,
  },
  {
    name: "Care Plans",
    path: "/care-plans",
    icon: ClipboardCheck,
  },
  {
    name: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex w-72 flex-col bg-blue-700 text-white shadow-xl">

      {/* Logo */}
      <div className="border-b border-blue-600 p-6">
        <h1 className="text-3xl font-bold">
          CareRelay
        </h1>

        <p className="mt-1 text-sm text-blue-100">
          Healthcare Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-700 shadow-md"
                    : "hover:bg-blue-600"
                }`
              }
            >
              <Icon size={20} />

              <span className="font-medium">
                {menu.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-blue-600 p-5">

        <div className="mb-4 flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-700">
            <ShieldCheck size={22} />
          </div>

          <div>
            <p className="font-semibold">
              Administrator
            </p>

            <p className="text-xs text-blue-100">
              Online
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 transition hover:bg-blue-500"
        >
          <LogOut size={18} />

          Logout
        </button>

      </div>

    </aside>
  );
}