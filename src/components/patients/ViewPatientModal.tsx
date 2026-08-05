import { Button, Modal } from "../../components/ui";
import { type Patient } from "../../types/patient";

interface ViewPatientModalProps {
  open: boolean;
  patient: Patient | null;
  onClose: () => void;
}

export default function ViewPatientModal({
  open,
  patient,
  onClose,
}: ViewPatientModalProps) {
  if (!patient) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Patient Details"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-semibold">{patient.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Age</p>
          <p className="font-semibold">{patient.age}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Gender</p>
          <p className="font-semibold">{patient.gender}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-semibold">{patient.status}</p>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}