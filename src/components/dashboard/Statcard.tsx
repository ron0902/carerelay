import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  color?: "blue" | "green" | "orange" | "red" | "purple";
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}: StatCardProps) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            {value}
          </h2>

          <p className="mt-3 text-sm font-medium text-green-600">
            {subtitle}
          </p>
        </div>

        <div
          className={`rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110 ${colors[color]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}