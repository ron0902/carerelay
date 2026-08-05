import { Button, Modal } from "../../components/ui";
import { type Patient } from "../../types/patient";

interface DeletePatientModalProps {
  open: boolean;
  patient: Patient | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePatientModal({
  open,
  patient,
  onClose,
  onConfirm,
}: DeletePatientModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Patient"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {patient?.name}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>
            Delete Patient
          </Button>
        </div>
      </div>
    </Modal>
  );
}