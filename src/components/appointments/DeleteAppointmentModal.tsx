import { Button, Modal } from "../../components/ui";
import { type Appointment } from "../../types/appointment";

interface DeleteAppointmentModalProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAppointmentModal({
  open,
  appointment,
  onClose,
  onConfirm,
}: DeleteAppointmentModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Appointment"
    >
      <div className="space-y-6">

        <p>
          Are you sure you want to delete the appointment for
          <span className="font-semibold">
            {" "}
            {appointment?.patientName}
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

          <Button
            variant="danger"
            onClick={onConfirm}
          >
            Delete
          </Button>

        </div>

      </div>
    </Modal>
  );
}