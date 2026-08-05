import { Button, Modal } from "../../components/ui";
import { type CareAssignment } from "../../types/assignment";

interface DeleteAssignmentModalProps {
  open: boolean;
  assignment: CareAssignment | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAssignmentModal({
  open,
  assignment,
  onClose,
  onConfirm,
}: DeleteAssignmentModalProps) {
  if (!assignment) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Assignment"
    >
      <div className="space-y-6">

        <p>
          Are you sure you want to delete the assignment for
          <span className="font-semibold">
            {" "}
            {assignment.patientName}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button onClick={onConfirm}>
            Delete
          </Button>

        </div>

      </div>
    </Modal>
  );
}