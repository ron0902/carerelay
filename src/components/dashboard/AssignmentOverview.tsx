import { useEffect, useState } from "react";
import { getAssignmentOverview } from "../../services/dashboardService";

export default function AssignmentOverview() {
  const [overview, setOverview] = useState({
    total: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    suspended: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignmentOverview = async () => {
      try {
        const response = await getAssignmentOverview();
        console.log("ASSIGNMENT OVERVIEW API:", response);

        if (response.success) {
          setOverview({
            total: Number(response.overview?.total ?? 0),
            active: Number(response.overview?.active ?? 0),
            completed: Number(response.overview?.completed ?? 0),
            cancelled: Number(response.overview?.cancelled ?? 0),
            suspended: Number(response.overview?.suspended ?? 0),
          });
        }
      } catch (error) {
        console.error("Assignment overview error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAssignmentOverview();
  }, []);

  const data = [
    {
      label: "Completed",
      value: overview.completed,
      color: "bg-green-500",
    },
    {
      label: "Active",
      value: overview.active,
      color: "bg-blue-500",
    },
    {
      label: "Cancelled",
      value: overview.cancelled,
      color: "bg-red-500",
    },
    {
      label: "Suspended",
      value: overview.suspended,
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Assignment Overview</h2>
        <span className="text-sm text-gray-500">
          Total: {loading ? "..." : overview.total}
        </span>
      </div>

      <div className="space-y-5">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between">
              <span>{item.label}</span>
              <span className="font-semibold">
                {loading ? "..." : item.value}
              </span>
            </div>

            <div className="h-3 rounded-full bg-gray-200">
              <div
                className={`${item.color} h-3 rounded-full transition-all`}
                style={{
                  width:
                    overview.total > 0
                      ? `${Math.min(
                          (item.value / overview.total) * 100,
                          100
                        )}%`
                      : "0%",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}