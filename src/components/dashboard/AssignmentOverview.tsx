export default function AssignmentOverview() {
  const data = [
    {
      label: "Completed",
      value: 116,
      color: "bg-green-500",
    },
    {
      label: "Active",
      value: 48,
      color: "bg-blue-500",
    },
    {
      label: "Pending",
      value: 12,
      color: "bg-yellow-500",
    },
    {
      label: "Cancelled",
      value: 3,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">
        Assignment Overview
      </h2>

      <div className="space-y-5">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between">
              <span>{item.label}</span>
              <span className="font-semibold">
                {item.value}
              </span>
            </div>

            <div className="h-3 rounded-full bg-gray-200">
              <div
                className={`${item.color} h-3 rounded-full`}
                style={{
                  width: `${Math.min(item.value, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}