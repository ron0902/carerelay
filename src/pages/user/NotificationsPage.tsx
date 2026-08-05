import { Card } from "../../components/ui";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  FileText,
} from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Shift Accepted",
      message: "Your shift for Maria Santos has been accepted.",
      type: "Shift",
      time: "5 mins ago",
      read: false,
    },
    {
      id: 2,
      title: "Appointment Reminder",
      message: "You have an appointment tomorrow at 8:00 AM.",
      type: "Appointment",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Visit Report Approved",
      message: "Your visit report has been approved.",
      type: "Report",
      time: "Yesterday",
      read: true,
    },
  ];

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

      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`transition hover:shadow-md ${
            !notification.read ? "border-l-4 border-l-blue-600" : ""
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-gray-100 p-3">{getIcon(notification.type)}</div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{notification.title}</h2>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>

              <p className="mt-2 text-gray-500">{notification.message}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
