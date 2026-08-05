import { Button, Modal } from "../../components/ui";
import { type Caregiver } from "../../types/caregiver";

interface ViewCaregiverModalProps {
  open: boolean;
  caregiver: Caregiver | null;
  onClose: () => void;
}

export default function ViewCaregiverModal({
  open,
  caregiver,
  onClose,
}: ViewCaregiverModalProps) {
  if (!caregiver) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Caregiver Details"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-semibold">{caregiver.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold">{caregiver.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-semibold">{caregiver.phone}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-semibold">{caregiver.status}</p>
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