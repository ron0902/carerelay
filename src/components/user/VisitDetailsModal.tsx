import { Button, Modal } from "../../components/ui";

export interface VisitShift {
  id: number;
  patient: string;
  date: string;
  time: string;
  status: string;
  service?: string;
  location?: string;
}

interface VisitDetailsModalProps {
  open: boolean;
  shift: VisitShift | null;
  onClose: () => void;
  onStartChecklist: () => void;
}

export default function VisitDetailsModal({
  open,
  shift,
  onClose,
  onStartChecklist,
}: VisitDetailsModalProps) {
  if (!shift) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Visit Details"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            {shift.patient}
          </h2>

          <p className="text-gray-500">
            Assigned Patient
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Visit Date</p>
            <p className="font-medium">{shift.date}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Visit Time</p>
            <p className="font-medium">{shift.time}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Service</p>
            <p className="font-medium">{shift.service ?? "Home Care"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{shift.location ?? "TBD"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">{shift.status}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Emergency Contact
            </p>
            <p className="font-medium">
              Maria's Daughter
            </p>
            <p className="text-sm text-gray-500">
              0912-345-6789
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">
            Care Plan
          </h3>

          <ul className="list-disc space-y-1 pl-5 text-gray-700">
            <li>Assist with mobility.</li>
            <li>Monitor blood pressure.</li>
            <li>Administer prescribed medication.</li>
            <li>Record observations.</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>

          <Button
            onClick={onStartChecklist}
          >
            Start Care Checklist
          </Button>
        </div>
      </div>
    </Modal>
  );
}