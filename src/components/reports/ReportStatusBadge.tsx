interface Props {
  status: "Ready" | "Generating" | "Archived";
}

export default function ReportStatusBadge({
  status,
}: Props) {
  const styles = {
    Ready:
      "bg-green-100 text-green-700",

    Generating:
      "bg-yellow-100 text-yellow-700",

    Archived:
      "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}