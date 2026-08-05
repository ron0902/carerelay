import { Button, Modal } from "../../components/ui";

export interface ShiftOffer {
  id: number;
  patient: string;
  date: string;
  time: string;
  zone: string;
  status: "Pending" | "Accepted" | "Declined";
}

interface Props {
  open: boolean;
  offer: ShiftOffer | null;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ShiftOfferDetailsModal({
  open,
  offer,
  onClose,
  onAccept,
  onDecline,
}: Props) {
  if (!offer) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Shift Offer Details"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Patient</p>
          <p className="font-semibold">{offer.patient}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-semibold">{offer.date}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Time</p>
          <p className="font-semibold">{offer.time}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Zone</p>
          <p className="font-semibold">{offer.zone}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-semibold">{offer.status}</p>
        </div>

        {offer.status === "Pending" && (
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={onDecline}
            >
              Decline
            </Button>

            <Button onClick={onAccept}>
              Accept Shift
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}