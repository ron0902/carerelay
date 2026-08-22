interface Props {
  status:
    | "Pending"
    | "Approved"
    | "In Progress"
    | "Completed"
    | "Cancelled"
    | "Rejected";
}

export default function AppointmentStatusBadge({
  status,
}: Props) {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    "In Progress": "bg-blue-100 text-blue-700",

    Completed:
      "bg-green-100 text-green-700",

    Cancelled:
      "bg-red-100 text-red-700",

    Rejected: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
}