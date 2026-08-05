interface CaregiverAvailabilityBadgeProps {
  availability: "Available" | "Busy" | "Off Duty";
}

export default function CaregiverAvailabilityBadge({
  availability,
}: CaregiverAvailabilityBadgeProps) {
  const styles = {
    Available: "bg-green-100 text-green-700",
    Busy: "bg-yellow-100 text-yellow-700",
    "Off Duty": "bg-gray-100 text-gray-700",
  };

  const dots = {
    Available: "bg-green-500",
    Busy: "bg-yellow-500",
    "Off Duty": "bg-gray-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        styles[availability]
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          dots[availability]
        }`}
      />

      {availability}
    </span>
  );
}