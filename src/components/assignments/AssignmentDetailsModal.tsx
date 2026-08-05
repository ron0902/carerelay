import { Button, Modal } from "../ui";

export interface Assignment {
  id: number;
  patient: string;
  caregiver: string;
  organization: string;
  date: string;
  time: string;
  status:
    | "Pending"
    | "Assigned"
    | "Accepted"
    | "Completed";
}

interface Props {
  open: boolean;
  assignment: Assignment | null;
  onClose: () => void;
}

export default function AssignmentDetailsModal({
  open,
  assignment,
  onClose,
}: Props) {
  if (!assignment) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assignment Details"
    >
      <div className="space-y-6">

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

            <p className="font-semibold">
              {assignment.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Patient
            </p>

            <p className="font-semibold">
              {assignment.patient}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Caregiver
            </p>

            <p className="font-semibold">
              {assignment.caregiver}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Organization
            </p>

            <p className="font-semibold">
              {assignment.organization}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Visit Schedule
            </p>

            <p className="font-semibold">
              {assignment.date}
            </p>

            <p>{assignment.time}</p>
          </div>

        </div>

        <div>
          <h3 className="font-semibold mb-2">
            Care Plan
          </h3>

          <ul className="list-disc pl-5 space-y-1">
            <li>Medication Assistance</li>
            <li>Blood Pressure Monitoring</li>
            <li>Meal Preparation</li>
            <li>Mobility Assistance</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">
            Emergency Contact
          </h3>

          <p>Maria Santos (Daughter)</p>
          <p>0912-345-6789</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
}