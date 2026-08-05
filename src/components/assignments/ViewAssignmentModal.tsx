import { useState } from "react";
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

  const [adminNotes, setAdminNotes] = useState("");
  const [reportStatus, setReportStatus] = useState<
    "Pending Review" | "Approved" | "Revision Requested"
  >("Pending Review");

  const statusColors: Record<string, string> = {
    Pending: "bg-gray-100 text-gray-700",
    Assigned: "bg-blue-100 text-blue-700",
    Accepted: "bg-green-100 text-green-700",
    "Visit Started": "bg-purple-100 text-purple-700",
    Completed: "bg-indigo-100 text-indigo-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Closed: "bg-red-100 text-red-700",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assignment Details"
    >
      <div className="space-y-6">

        {/* Assignment Information */}
        <div>
          <h2 className="mb-3 text-lg font-semibold border-b pb-2">
            Assignment Information
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Assignment ID
              </p>
              <p className="font-semibold">
                #{assignment.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

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
                <option>Pending</option>
                <option>Assigned</option>
                <option>Accepted</option>
                <option>Visit Started</option>
                <option>Completed</option>
                <option>Approved</option>
                <option>Closed</option>
              </select>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Patient
              </p>
              <p className="font-semibold">
                {assignment.patientName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Caregiver
              </p>
              <p className="font-semibold">
                {assignment.caregiverName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Start Date
              </p>
              <p className="font-semibold">
                {assignment.startDate}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Organization
              </p>
              <p className="font-semibold">
                General Hospital
              </p>
            </div>

          </div>
        </div>

        {/* Assignment Status */}
        <div>
          <h2 className="mb-3 text-lg font-semibold border-b pb-2">
            Assignment Status
          </h2>

          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
              statusColors[assignment.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {assignment.status}
          </span>
        </div>

        {/* Care Plan */}

        <div>
          <h2 className="mb-3 text-lg font-semibold border-b pb-2">
            Care Plan
          </h2>

          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Medication Assistance</li>
            <li>Blood Pressure Monitoring</li>
            <li>Meal Preparation</li>
            <li>Mobility Assistance</li>
          </ul>
        </div>

        {/* Emergency Contact */}

        <div>
          <h2 className="mb-3 text-lg font-semibold border-b pb-2">
            Emergency Contact
          </h2>

          <p className="font-medium">
            Maria Santos (Daughter)
          </p>

          <p className="text-gray-500">
            0912-345-6789
          </p>
        </div>

        {/* Timeline */}

        <div>
          <h2 className="mb-3 text-lg font-semibold border-b pb-2">
            Assignment Timeline
          </h2>

          <div className="space-y-2 text-sm">

            <div>✅ Assignment Created</div>

            <div>👨‍⚕️ Caregiver Assigned</div>

            <div>📅 Visit Scheduled</div>

            <div>🚗 Visit Started</div>

            <div>✔ Visit Completed</div>

          </div>
        </div>

        {/* Visit Report */}

        <div>
          <h2 className="mb-3 text-lg font-semibold border-b pb-2">
            Visit Report
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Blood Pressure
              </p>

              <p>120 / 80</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Temperature
              </p>

              <p>36.7 °C</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Pulse Rate
              </p>

              <p>72 bpm</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Pain Level
              </p>

              <p>2 / 10</p>
            </div>

          </div>

          <div className="mt-4">

            <p className="text-sm text-gray-500">
              Caregiver Notes
            </p>

            <p>
              Patient is stable and responded well to
              medication. Mobility assistance provided.
            </p>

          </div>
        </div>

        {/* Report Review */}

        <div>
          <h2 className="mb-3 text-lg font-semibold border-b pb-2">
            Report Review
          </h2>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-gray-500">
                Review Status
              </p>

              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  reportStatus === "Approved"
                    ? "bg-green-100 text-green-700"
                    : reportStatus === "Revision Requested"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {reportStatus}
              </span>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Admin Notes
              </label>

              <textarea
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full rounded-lg border p-3"
                placeholder="Add internal review notes..."
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-6">
          <Button
            variant="secondary"
            onClick={() => window.print()}
          >
            Print Report
          </Button>

          <Button
            variant="secondary"
            onClick={() => setReportStatus("Revision Requested")}
          >
            Request Revision
          </Button>

          <Button onClick={() => setReportStatus("Approved")}>
            Approve Report
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
}