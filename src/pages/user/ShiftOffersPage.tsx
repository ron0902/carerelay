import { useState } from "react";
import { Button, Card } from "../../components/ui";
import ShiftOfferDetailsModal, {
  type ShiftOffer as ModalShiftOffer,
} from "../../components/user/ShiftOfferDetailsModal";
import ShiftOfferConfirmModal from "../../components/user/ShiftOfferConfirmModal";
import {
  Building2,
  CalendarDays,
  Clock,
  MapPin,
  UserCircle2,
} from "lucide-react";

interface ShiftOffer {
  id: number;
  organization: string;
  patient: string;
  service: string;
  date: string;
  time: string;
  location: string;
  duration: string;
  status: "Pending" | "Accepted" | "Declined";
}

export default function ShiftOffersPage() {
  const [offers, setOffers] = useState<ShiftOffer[]>([
    {
      id: 1,
      organization: "Sunrise Care",
      patient: "Maria Santos",
      service: "Home Care Visit",
      date: "July 30, 2026",
      time: "8:00 AM - 4:00 PM",
      location: "General Santos City",
      duration: "8 Hours",
      status: "Pending",
    },
    {
      id: 2,
      organization: "HealthFirst",
      patient: "Juan Dela Cruz",
      service: "Medication Assistance",
      date: "August 1, 2026",
      time: "9:00 AM - 1:00 PM",
      location: "Koronadal City",
      duration: "4 Hours",
      status: "Pending",
    },
  ]);

  const [selectedOffer, setSelectedOffer] =
    useState<ModalShiftOffer | null>(null);
  const [confirmAction, setConfirmAction] =
    useState<"Accepted" | "Declined" | null>(null);

  const badgeColor = (status: ShiftOffer["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Declined":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const updateOfferStatus = (
    id: number,
    status: "Accepted" | "Declined"
  ) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === id
          ? { ...offer, status }
          : offer
      )
    );

    setSelectedOffer(null);
  };

  const handleConfirmAction = () => {
    if (!selectedOffer || !confirmAction) return;

    updateOfferStatus(selectedOffer.id, confirmAction);
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Shift Offers
        </h1>

        <p className="text-gray-500">
          Review and respond to available shift offers.
        </p>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className="rounded-xl border p-5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-3">
                <div className="rounded-2xl bg-slate-100 p-3">
                  <UserCircle2 size={24} className="text-blue-600" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold">{offer.patient}</h2>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${badgeColor(
                        offer.status
                      )}`}
                    >
                      {offer.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-600">{offer.service}</p>
                  <p className="mt-2 text-sm text-slate-500">{offer.organization}</p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {offer.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {offer.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {offer.location}
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    Duration: {offer.duration}
                  </p>
                </div>
              </div>

              {offer.status === "Pending" && (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => setSelectedOffer(offer)}>
                    View Details
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => updateOfferStatus(offer.id, "Declined")}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <ShiftOfferDetailsModal
        open={selectedOffer !== null}
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        onAccept={() => {
          setConfirmAction("Accepted");
        }}
        onDecline={() => {
          setConfirmAction("Declined");
        }}
      />

      <ShiftOfferConfirmModal
        open={confirmAction !== null && selectedOffer !== null}
        offer={selectedOffer}
        action={confirmAction}
        onClose={() => {
          setConfirmAction(null);
          setSelectedOffer(null);
        }}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}