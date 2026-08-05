import { useState } from "react";
import { Button, Modal } from "../../components/ui";

interface DropShiftModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function DropShiftModal({
  open,
  onClose,
  onConfirm,
}: DropShiftModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return;

    onConfirm(reason);
    setReason("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Can't Make This Shift"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-2 block font-medium">
            Reason
          </label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please explain why you can't make this shift..."
            className="min-h-32 w-full rounded-lg border border-gray-300 p-3"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={!reason.trim()}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}