import { Button, Modal } from "../../components/ui";
import { type ShiftOffer } from "./ShiftOfferDetailsModal";

interface Props {
  open: boolean;
  offer: ShiftOffer | null;
  action: "Accepted" | "Declined" | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ShiftOfferConfirmModal({
  open,
  offer,
  action,
  onClose,
  onConfirm,
}: Props) {
  if (!offer || !action) return null;

  const isAccepting = action === "Accepted";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        isAccepting
          ? "Confirm Shift Acceptance"
          : "Confirm Shift Decline"
      }
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Are you sure you want to{" "}
          <span className="font-semibold">
            {isAccepting ? "accept" : "decline"}
          </span>{" "}
          this shift for {offer.patient}?
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>
            {isAccepting
              ? "Yes, Accept Shift"
              : "Yes, Decline Shift"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}