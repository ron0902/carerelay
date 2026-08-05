interface AssignmentStatusBadgeProps {
  status: "Pending" | "Active" | "Completed" | "Cancelled";
}

export const AssignmentStatusBadge = ({
  status,
}: AssignmentStatusBadgeProps) => {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Active: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const dots = {
    Pending: "bg-yellow-500",
    Active: "bg-green-500",
    Completed: "bg-blue-500",
    Cancelled: "bg-red-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${dots[status]}`}
      />

      {status}
    </span>
  );
}