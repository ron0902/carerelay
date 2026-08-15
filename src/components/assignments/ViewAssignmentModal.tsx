import { Button, Modal } from "../../components/ui";
import { type CareAssignment } from "../../types/assignment";

interface ViewAssignmentModalProps {
  open: boolean;
  assignment: CareAssignment | null;
  onClose: () => void;
  onStatusChange: (
    id: number,
    status: CareAssignment["status"]
  ) => void;
}

export default function ViewAssignmentModal({
  open,
  assignment,
  onClose,
  onStatusChange,
}: ViewAssignmentModalProps) {
  if (!assignment) return null;

  const statusColors: Record<string, string> = {
    Pending: "bg-gray-100 text-gray-700",
    Active: "bg-blue-100 text-blue-700",
    Assigned: "bg-blue-100 text-blue-700",
    Accepted: "bg-green-100 text-green-700",
    "Visit Started": "bg-purple-100 text-purple-700",
    Completed: "bg-indigo-100 text-indigo-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700",
    Closed: "bg-red-100 text-red-700",
  };

  return (
    <Modal open={open} onClose={onClose} title="Assignment Details">
      <div className="space-y-6">
        <section>
          <h2 className="mb-4 border-b pb-2 text-lg font-semibold">
            Assignment Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Assignment ID</p>
              <p className="font-semibold">#{assignment.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Patient</p>
              <p className="font-semibold">{assignment.patientName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Caregiver</p>
              <p className="font-semibold">{assignment.caregiverName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Organization</p>
              <p className="font-semibold">{assignment.organizationName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned By</p>
              <p className="font-semibold">{assignment.assignedByName || `User #${assignment.assignedBy}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Assigned Date</p>
              <p className="font-semibold">{assignment.assignedDate || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-semibold">{assignment.startDate || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-semibold">{assignment.endDate || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shift</p>
              <p className="font-semibold">{assignment.shift || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <select
                value={assignment.status}
                onChange={(e) =>
                  onStatusChange(
                    assignment.id,
                    e.target.value as CareAssignment["status"]
                  )
                }
                className="mt-2 w-full rounded-lg border p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Assigned">Assigned</option>
                <option value="Accepted">Accepted</option>
                <option value="Visit Started">Visit Started</option>
                <option value="Approved">Approved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 border-b pb-2 text-lg font-semibold">Assignment Status</h2>
          <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusColors[assignment.status] || "bg-gray-100 text-gray-700"}`}>
            {assignment.status}
          </span>
        </section>

        <section>
          <h2 className="mb-3 border-b pb-2 text-lg font-semibold">Remarks</h2>
          <div className="rounded-lg bg-gray-50 p-4 text-gray-700">
            {assignment.remarks || "No remarks available."}
          </div>
        </section>

        <section>
          <h2 className="mb-3 border-b pb-2 text-lg font-semibold">Record Information</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-semibold">{assignment.createdAt || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Updated At</p>
              <p className="font-semibold">{assignment.updatedAt || "N/A"}</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end border-t pt-5">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
