import { useState } from "react";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  UserCheck,
  CheckCheck,
} from "lucide-react";

import { Button, Card, EmptyState } from "../../components/ui";

interface PatientNotification {
  id: number;
  title: string;
  message: string;
  type: "Appointment" | "Caregiver" | "Care Plan" | "System";
  time: string;
  read: boolean;
}

export default function PatientNotificationsPage() {
  const [notifications, setNotifications] = useState<
    PatientNotification[]
  >([
    {
      id: 1,
      title: "Appointment Confirmed",
      message:
        "Your home care visit with John Reyes has been confirmed.",
      type: "Appointment",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Caregiver Updated",
      message:
        "John Reyes is now assigned as your primary caregiver.",
      type: "Caregiver",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Care Plan Updated",
      message:
        "Your current care plan has been reviewed and updated.",
      type: "Care Plan",
      time: "Yesterday",
      read: true,
    },
    {
      id: 4,
      title: "Appointment Reminder",
      message:
        "You have a scheduled visit tomorrow at 9:00 AM.",
      type: "System",
      time: "Yesterday",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
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
      {notifications.length === 0 ? (
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
                      onClick={() =>
                        markAsRead(notification.id)
                      }
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