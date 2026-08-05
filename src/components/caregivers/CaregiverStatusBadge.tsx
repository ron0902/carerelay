interface CaregiverStatusBadgeProps {
  status: "Active" | "Inactive";
}

export default function CaregiverStatusBadge({
  status,
}: CaregiverStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <span
        className={`mr-2 h-2 w-2 rounded-full ${
          status === "Active"
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />
      {status}
    </span>
  );
}