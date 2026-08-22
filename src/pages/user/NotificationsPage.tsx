import { useEffect, useState } from "react";
import { Button, Card } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import {
  getCaregiverNotifications,
  markCaregiverNotificationRead,
} from "../../services/caregiverService";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  FileText,
} from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await getCaregiverNotifications(user.id);
      setNotifications(response.success ? response.notifications || [] : []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, [user?.id]);

  const markAsRead = async (notificationId: number) => {
    if (!user?.id) return;

    try {
      const response = await markCaregiverNotificationRead(
        user.id,
        notificationId
      );
      if (response.success) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notificationId ? { ...item, is_read: 1 } : item
          )
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const formatTime = (createdAt: string) =>
    new Date(createdAt).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getIcon = (type: string) => {
    switch (type) {
      case "Shift":
        return <ClipboardList className="text-blue-600" size={22} />;

      case "Appointment":
        return <CalendarDays className="text-green-600" size={22} />;

      case "Report":
        return <FileText className="text-purple-600" size={22} />;

      default:
        return <Bell className="text-gray-600" size={22} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500">Stay updated with your latest activities.</p>
        </div>
      </div>

      {loading ? (
        <Card><p className="text-gray-500">Loading notifications...</p></Card>
      ) : notifications.length === 0 ? (
        <Card><p className="text-gray-500">No notifications yet.</p></Card>
      ) : notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`transition hover:shadow-md ${
            !Number(notification.is_read) ? "border-l-4 border-l-blue-600" : ""
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-gray-100 p-3">{getIcon(notification.type)}</div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{notification.title}</h2>
                <span className="text-xs text-gray-500">
                  {formatTime(notification.created_at)}
                </span>
              </div>

              <p className="mt-2 text-gray-500">{notification.message}</p>
              {!Number(notification.is_read) && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => void markAsRead(Number(notification.id))}
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
