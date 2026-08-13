interface Props {
  status:
    | "Scheduled"
    | "Completed"
    | "Cancelled"
    | "No Show";
}

export default function AppointmentStatusBadge({
  status,
}: Props) {
  const colors = {
    Scheduled:
      "bg-blue-100 text-blue-700",

    Completed:
      "bg-green-100 text-green-700",

    Cancelled:
      "bg-red-100 text-red-700",

    "No Show":
      "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
}