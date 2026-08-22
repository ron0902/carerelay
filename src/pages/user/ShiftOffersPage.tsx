import { useEffect, useState } from "react";
import { Button, Card } from "../../components/ui";
import CaregiverShiftOfferDetailsModal, {
  type CaregiverShiftOffer,
} from "../../components/user/CaregiverShiftOfferDetailsModal";
import { useAuth } from "../../context/AuthContext";
import {
  getShiftOffers,
  respondToShiftOffer,
} from "../../services/caregiverService";
import {
  CalendarDays,
  Clock,
  UserCircle2,
} from "lucide-react";

export default function ShiftOffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<CaregiverShiftOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingOfferId, setRespondingOfferId] = useState<number | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<CaregiverShiftOffer | null>(null);

  useEffect(() => {
    loadOffers();
  }, [user?.id]);

  const loadOffers = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await getShiftOffers(user.id);
      console.log("SHIFT OFFERS API:", JSON.stringify(response, null, 2));

      if (!response.success) {
        console.error(response.message);
        setOffers([]);
        return;
      }

      setOffers(response.offers || []);
    } catch (error) {
      console.error("Failed to load shift offers:", error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferResponse = async (
    offerId: number,
    status: "Accepted" | "Declined"
  ) => {
    if (!user?.id) return;

    try {
      setRespondingOfferId(offerId);
      const response = await respondToShiftOffer(
        user.id,
        offerId,
        status
      );

      if (!response.success) {
        window.alert(response.message || "Unable to update shift offer.");
        return;
      }

      setSelectedOffer(null);
      await loadOffers();
    } catch (error) {
      console.error("Failed to respond to shift offer:", error);
      window.alert("Failed to respond to shift offer.");
    } finally {
      setRespondingOfferId(null);
    }
  };

  const badgeColor = (status: CaregiverShiftOffer["offer_status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Declined":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shift Offers</h1>
        <p className="text-gray-500">
          Review and respond to available shift offers.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-xl border p-6 text-center text-gray-500">
            Loading shift offers...
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-xl border p-6 text-center text-gray-500">
            No shift offers available.
          </div>
        ) : (
          offers.map((offer) => (
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
                      <h2 className="text-xl font-semibold">
                        {offer.patient_name}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${badgeColor(
                          offer.offer_status
                        )}`}
                      >
                        {offer.offer_status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-600">
                      Caregiver Shift
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {offer.organization_name || "Organization not specified"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {offer.start_date}
                        {offer.end_date ? ` - ${offer.end_date}` : ""}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={16} />
                        {offer.shift}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedOffer(offer)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <CaregiverShiftOfferDetailsModal
        open={selectedOffer !== null}
        offer={selectedOffer}
        responding={
          selectedOffer !== null && respondingOfferId === selectedOffer.id
        }
        onClose={() => setSelectedOffer(null)}
        onAccept={() => {
          if (selectedOffer) {
            void handleOfferResponse(selectedOffer.id, "Accepted");
          }
        }}
        onDecline={() => {
          if (selectedOffer) {
            void handleOfferResponse(selectedOffer.id, "Declined");
          }
        }}
      />
    </div>
  );
}
