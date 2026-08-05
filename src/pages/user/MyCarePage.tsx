import { Card } from "../../components/ui";

export default function MyCarePage() {
  const careAssignment = {
    caregiverName: "John Reyes",
    startDate: "2026-07-15",
    status: "Active",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Care</h1>
        <p className="text-gray-500">
          View your current care assignment.
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">
              Assigned Caregiver
            </p>
            <p className="text-xl font-semibold">
              {careAssignment.caregiverName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Start Date
            </p>
            <p className="font-medium">
              {careAssignment.startDate}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>
            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              {careAssignment.status}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}