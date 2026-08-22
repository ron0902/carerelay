import { Button, Modal } from "../../components/ui";

export interface CaregiverShiftOffer {
  id: number;
  assignment_id: number;
  caregiver_id?: number;
  offered_by?: number;
  organization_name: string | null;
  patient_name: string;
  assigned_date?: string;
  start_date: string;
  end_date: string | null;
  shift: string;
  offer_status: "Pending" | "Accepted" | "Declined";
  assignment_status: string;
  remarks: string | null;
  offered_at?: string;
  responded_at?: string | null;
}

interface CaregiverShiftOfferDetailsModalProps {
  open: boolean;
  offer: CaregiverShiftOffer | null;
  responding: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export default function CaregiverShiftOfferDetailsModal({
  open,
  offer,
  responding,
  onClose,
  onAccept,
  onDecline,
}: CaregiverShiftOfferDetailsModalProps) {
  if (!offer) return null;

  return (
    <Modal open={open} onClose={onClose} title="Shift Offer Details">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Patient</p>
            <p className="font-semibold text-slate-700">{offer.patient_name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Organization</p>
            <p className="font-semibold text-slate-700">
              {offer.organization_name || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Start Date</p>
            <p className="font-semibold text-slate-700">{offer.start_date}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">End Date</p>
            <p className="font-semibold text-slate-700">
              {offer.end_date || "Ongoing"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Shift</p>
            <p className="font-semibold text-slate-700">{offer.shift}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Offer Status</p>
            <p className="font-semibold text-slate-700">{offer.offer_status}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Assignment Status</p>
            <p className="font-semibold text-slate-700">{offer.assignment_status}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Assignment ID</p>
            <p className="font-semibold text-slate-700">{offer.assignment_id}</p>
          </div>
        </div>

        {offer.remarks && (
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-sm text-slate-500">Remarks</p>
            <p className="mt-1 text-slate-700">{offer.remarks}</p>
          </div>
        )}

        {offer.offer_status === "Pending" && (
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="secondary" onClick={onDecline} disabled={responding}>
              {responding ? "Saving..." : "Decline"}
            </Button>
            <Button onClick={onAccept} disabled={responding}>
              {responding ? "Saving..." : "Accept Shift"}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
