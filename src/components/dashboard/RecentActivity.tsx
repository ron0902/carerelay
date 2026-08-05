const activities = [
  {
    id: 1,
    message: 'Patient "Maria Santos" was added.',
    time: "5 minutes ago",
    color: "bg-green-500",
  },
  {
    id: 2,
    message: "Appointment scheduled.",
    time: "20 minutes ago",
    color: "bg-yellow-500",
  },
  {
    id: 3,
    message: 'Caregiver "John Cruz" assigned.',
    time: "1 hour ago",
    color: "bg-blue-500",
  },
  {
    id: 4,
    message: 'Organization "ABC Healthcare" approved.',
    time: "Yesterday",
    color: "bg-purple-500",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="mb-5 text-xl font-bold">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4"
          >
            <div
              className={`mt-2 h-3 w-3 rounded-full ${activity.color}`}
            />

            <div>
              <p className="font-medium">
                {activity.message}
              </p>

              <p className="text-sm text-gray-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}