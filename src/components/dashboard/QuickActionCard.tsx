import type { ReactNode } from "react";

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function QuickActionCard({
  title,
  subtitle,
  icon,
  variant = "primary",
  onClick,
}: QuickActionCardProps) {
  const baseClasses =
    variant === "secondary"
      ? "rounded-lg border border-gray-300 bg-white p-4 text-gray-700 transition hover:bg-gray-50"
      : "rounded-lg bg-blue-600 p-4 text-white transition hover:bg-blue-700";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 text-left ${baseClasses}`}
    >
      <div className="rounded-full bg-white/20 p-2">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm opacity-90">{subtitle}</p>
      </div>
    </button>
  );
}