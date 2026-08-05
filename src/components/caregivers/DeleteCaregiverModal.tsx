import { Button, Modal } from "../../components/ui";
import { type Caregiver } from "../../types/caregiver";

interface DeleteCaregiverModalProps {
  open: boolean;
  caregiver: Caregiver | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCaregiverModal({
  open,
  caregiver,
  onClose,
  onConfirm,
}: DeleteCaregiverModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Caregiver"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {caregiver?.name}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>
            Delete Caregiver
          </Button>
        </div>
      </div>
    </Modal>
  );
}