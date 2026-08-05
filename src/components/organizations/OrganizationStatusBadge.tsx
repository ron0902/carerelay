interface OrganizationStatusBadgeProps {
  status: "Active" | "Inactive";
}

export default function OrganizationStatusBadge({
  status,
}: OrganizationStatusBadgeProps) {

  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />

      {status}
    </span>
  );
}