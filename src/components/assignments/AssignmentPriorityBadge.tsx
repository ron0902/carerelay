interface AssignmentPriorityBadgeProps {
  priority: "Low" | "Medium" | "High";
}

export default function AssignmentPriorityBadge({
  priority,
}: AssignmentPriorityBadgeProps) {
  const colors = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[priority]}`}
    >
      {priority}
    </span>
  );
}