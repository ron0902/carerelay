import { CheckCircle, Clock, UserPlus } from "lucide-react";

interface ActivityCardProps {
  title: string;
  description: string;
  time: string;
  type: "success" | "user" | "pending";
}

export default function ActivityCard({
  title,
  description,
  time,
  type,
}: ActivityCardProps) {
  const icon =
    type === "success" ? (
      <CheckCircle className="text-green-600" size={20} />
    ) : type === "user" ? (
      <UserPlus className="text-blue-600" size={20} />
    ) : (
      <Clock className="text-orange-500" size={20} />
    );

  return (
    <div className="flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      <div>{icon}</div>

      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="mt-2 text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}