import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getCaregiverNotifications } from "../../services/caregiverService";

const menus = [
  { name: "Dashboard", path: "/user/dashboard" },
  { name: "My Shifts", path: "/user/shifts" },
  { name: "My Schedule", path: "/user/schedule" },
  { name: "Availability", path: "/user/availability" },
  { name: "Shift Offers", path: "/user/offers" },
  { name: "Notifications", path: "/user/notifications", icon: Bell },
  { name: "Profile", path: "/user/profile" },
];

export default function UserSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    getCaregiverNotifications(user.id)
      .then((response) => {
        if (response.success) {
          setUnreadCount(Number(response.unread_count ?? 0));
        }
      })
      .catch((error) => console.error("Failed to load notification count:", error));
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="min-h-screen w-64 bg-blue-700 text-white">
      <div className="p-6">
        <h1 className="text-3xl font-bold">
          CareRelay
        </h1>

        <p className="mt-1 text-sm text-blue-100">
          Caregiver Portal
        </p>
      </div>

      <nav className="flex flex-col px-3">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `mb-2 flex items-center justify-between rounded-lg px-4 py-3 transition ${
                  isActive ? "bg-white text-blue-700" : "hover:bg-blue-600"
                }`
              }
            >
              <span className="flex items-center gap-3">
                {Icon ? <Icon size={18} /> : null}
                {menu.name === "Notifications" ? (
                  <>
                    {menu.name}
                    {unreadCount > 0 && (
                      <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                        {unreadCount}
                      </span>
                    )}
                  </>
                ) : (
                  menu.name
                )}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-blue-600 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-500"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}