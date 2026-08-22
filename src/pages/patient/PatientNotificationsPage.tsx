import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  UserCheck,
  CheckCheck,
} from "lucide-react";

import { Button, Card, EmptyState } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import {
  getPatientNotifications,
  markPatientNotificationRead,
} from "../../services/patientService";

interface PatientNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  time: string;
  read: boolean;
}

export default function PatientNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<
    PatientNotification[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        const response = await getPatientNotifications(user.id);
        setNotifications(
          response.success
            ? (response.notifications || []).map((item: any) => ({
                id: Number(item.id),
                title: item.title,
                message: item.message,
                type: item.type,
                time: new Date(item.created_at).toLocaleString(),
                read: Boolean(Number(item.is_read)),
              }))
            : []
        );
      } catch (error) {
        console.error("Failed to load patient notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    void loadNotifications();
  }, [user?.id]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = async (id: number) => {
    if (!user?.id) return;

    try {
      await markPatientNotificationRead(user.id, id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = async () => {
    await Promise.all(
      notifications
        .filter((notification) => !notification.read)
        .map((notification) => markAsRead(notification.id))
    );
  };

  const getIcon = (
    type: PatientNotification["type"]
  ) => {
    switch (type) {
      case "Appointment":
        return (
          <CalendarDays
            size={22}
            className="text-blue-600"
          />
        );

      case "Caregiver":
        return (
          <UserCheck
            size={22}
            className="text-green-600"
          />
        );

      case "Care Plan":
        return (
          <ClipboardList
            size={22}
            className="text-purple-600"
          />
        );

      default:
        return (
          <Bell
            size={22}
            className="text-yellow-600"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="text-gray-500">
            Stay updated with your care activities.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            onClick={markAllAsRead}
          >
            <CheckCheck size={18} />
            <span className="ml-2">
              Mark All as Read
            </span>
          </Button>
        )}
      </div>

      {/* Summary */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <Bell size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Unread Notifications
            </p>

            <p className="mt-1 text-2xl font-bold">
              {unreadCount}
            </p>
          </div>
        </div>
      </Card>

      {/* Notification List */}
      {loading ? (
        <Card><p className="text-gray-500">Loading notifications...</p></Card>
      ) : notifications.length === 0 ? (
        <Card>
          <EmptyState
            title="No notifications"
            description="You're all caught up."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                !notification.read
                  ? "border-l-4 border-l-blue-600 bg-blue-50/30"
                  : "border border-gray-200"
              }`}
            >
              <div className="flex min-w-0 items-start gap-4">
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-900">
                        {notification.title}
                      </h2>

                      {!notification.read && (
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          New
                        </span>
                      )}
                    </div>

                    <span className="shrink-0 text-xs text-gray-400">
                      {notification.time}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {notification.message}
                  </p>

                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => void markAsRead(notification.id)}
                      className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}