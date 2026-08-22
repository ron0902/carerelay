import { useEffect, useState } from "react";
import { Button, Card } from "../../components/ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CaregiverShiftOfferDetailsModal from "../../components/user/CaregiverShiftOfferDetailsModal";
import CaregiverAppointmentDetailsModal, {
  type CaregiverAppointment,
} from "../../components/user/CaregiverAppointmentDetailsModal";
import {
  getCaregiverDashboard,
  getShiftOffers,
  getTodaysSchedule,
  respondToShiftOffer,
  startCaregiverVisit,
} from "../../services/caregiverService";
import {
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle,
  Clock,
  ClipboardList,
  MapPin,
  User,
  UserCircle2,
} from "lucide-react";

interface ShiftOffer {
  id: number;
  assignment_id: number;
  organization_name: string | null;
  patient_name: string;
  start_date: string;
  end_date: string | null;
  shift: string;
  offer_status: "Pending" | "Accepted" | "Declined";
  assignment_status: string;
  remarks: string | null;
}

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offers, setOffers] = useState<ShiftOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [respondingOfferId, setRespondingOfferId] = useState<number | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<ShiftOffer | null>(null);

  const [todaysSchedule, setTodaysSchedule] =
    useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<CaregiverAppointment | null>(null);
  const [startingAppointmentId, setStartingAppointmentId] =
    useState<number | null>(null);
  const [dashboardData, setDashboardData] = useState({
    todaysShifts: 0,
    upcomingVisits: 0,
    pendingOffers: 0,
    completedVisits: 0,
  });
  const [loadingDashboard, setLoadingDashboard] =
    useState(true);

  const caregiverName = `${user?.first_name ?? ""} ${
    user?.last_name ?? ""
  }`.trim();

  useEffect(() => {
    if (!user?.id) {
      console.error("No authenticated user ID:", user);
      return;
    }

    loadCaregiverDashboard();
    loadTodaysSchedule();
    loadShiftOffers();
  }, [user?.id]);

  const loadCaregiverDashboard = async () => {
    if (!user?.id) {
      console.error("No authenticated user ID:", user);
      return;
    }

    try {
      setLoadingDashboard(true);
      console.log("AUTH USER:", user);
      console.log("USER ID:", user.id);
      console.log("Loading caregiver dashboard for user ID:", user.id);
      const response =
        await getCaregiverDashboard(user.id);
      console.log(
        "CAREGIVER DASHBOARD API:",
        JSON.stringify(response, null, 2)
      );
      if (response.success) {
        setDashboardData({
          todaysShifts: Number(
            response.stats?.todaysShifts ?? 0
          ),
          upcomingVisits: Number(
            response.stats?.upcomingVisits ?? 0
          ),
          pendingOffers: Number(
            response.stats?.pendingOffers ?? 0
          ),
          completedVisits: Number(
            response.stats?.completedVisits ?? 0
          ),
        });
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(
        "Caregiver dashboard error:",
        error
      );
    } finally {
      setLoadingDashboard(false);
    }
  };

  const loadTodaysSchedule = async () => {
    if (!user?.id) return;
    try {
      const response =
        await getTodaysSchedule(user.id);
      console.log(
        "TODAY SCHEDULE API:",
        JSON.stringify(response, null, 2)
      );
      if (response.success) {
        setTodaysSchedule(
          response.appointments || []
        );
      }
    } catch (error) {
      console.error(
        "Today's schedule error:",
        error
      );
    }
  };

  const handleStartVisit = async (appointmentId: number) => {
    if (!user?.id) return;

    try {
      setStartingAppointmentId(appointmentId);
      const response = await startCaregiverVisit(
        user.id,
        appointmentId
      );

      if (!response.success) {
        window.alert(response.message || "Unable to start visit.");
        return;
      }

      await loadTodaysSchedule();
      await loadCaregiverDashboard();
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Failed to start visit:", error);
      const apiError = error as {
        response?: { data?: { message?: string } };
      };
      window.alert(
        apiError.response?.data?.message || "Failed to start visit."
      );
    } finally {
      setStartingAppointmentId(null);
    }
  };

  const loadShiftOffers = async () => {
    if (!user?.id) return;

    try {
      setLoadingOffers(true);
      const response = await getShiftOffers(user.id);
      console.log(
        "SHIFT OFFERS API:",
        JSON.stringify(response, null, 2)
      );

      if (response.success) {
        setOffers(response.offers || []);
      } else {
        console.error(response.message);
        setOffers([]);
      }
    } catch (error) {
      console.error("Shift offers error:", error);
      setOffers([]);
    } finally {
      setLoadingOffers(false);
    }
  };

  const dashboardStats = [
    {
      title: "Today's Shifts",
      value: loadingDashboard
        ? "..."
        : dashboardData.todaysShifts,
      icon: <CalendarDays size={28} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Upcoming Visits",
      value: loadingDashboard
        ? "..."
        : dashboardData.upcomingVisits,
      icon: <Clock size={28} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Pending Offers",
      value: loadingOffers
        ? "..."
        : offers.filter(
            (offer) => offer.offer_status === "Pending"
          ).length,
      icon: <ClipboardList size={28} />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Completed Visits",
      value: loadingDashboard
        ? "..."
        : dashboardData.completedVisits,
      icon: <CheckCircle size={28} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const badgeColor = (status: ShiftOffer["offer_status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Declined":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const handleOfferResponse = async (
    id: number,
    status: "Accepted" | "Declined"
  ): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      setRespondingOfferId(id);
      const response = await respondToShiftOffer(
        user.id,
        id,
        status
      );
      console.log(
        "SHIFT OFFER RESPONSE:",
        JSON.stringify(response, null, 2)
      );

      if (!response.success) {
        window.alert(response.message || "Unable to update shift offer.");
        return false;
      }

      await loadShiftOffers();
      await loadCaregiverDashboard();
      return true;
    } catch (error) {
      console.error("Failed to respond to shift offer:", error);
      window.alert("Failed to respond to shift offer.");
      return false;
    } finally {
      setRespondingOfferId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Good Morning 👋</p>

            <h1 className="mt-2 text-4xl font-bold">
              {caregiverName}
            </h1>

            <p className="mt-2 text-blue-100">
              Welcome back to CareRelay. Here's your schedule for today.
            </p>
          </div>

          <div className="rounded-full bg-white/20 p-5">
            <User size={50} />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card
            key={stat.title}
            className="transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">{stat.title}</p>

                <h2 className="mt-2 text-4xl font-bold">
                  {stat.value}
                </h2>
              </div>

              <div className={`rounded-xl p-4 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Today's Schedule
            </h2>
            <p className="text-sm text-gray-500">
              Your scheduled home care visits.
            </p>
          </div>
          <CalendarDays
            size={28}
            className="text-blue-600"
          />
        </div>
        <div className="space-y-4">
          {todaysSchedule.length === 0 ? (
            <div className="rounded-xl border p-6 text-center text-gray-500">
              No appointments scheduled for today.
            </div>
          ) : (
            todaysSchedule.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-xl border p-5 transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {appointment.patient_name}
                    </h3>
                    <p className="mt-1 text-gray-500">
                      {appointment.appointment_type}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
                    {appointment.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-gray-500">
                  <Clock size={18} />
                  {appointment.appointment_time}
                </div>
                <div className="mt-2 flex items-center gap-2 text-gray-500">
                  <MapPin size={18} />
                  {appointment.location ||
                    "Location not specified"}
                </div>
                <div className="mt-5 flex gap-3">
                  <Button
                    size="sm"
                    disabled={
                      appointment.status === "In Progress" ||
                      startingAppointmentId === appointment.id
                    }
                    onClick={() => handleStartVisit(appointment.id)}
                  >
                    {startingAppointmentId === appointment.id
                      ? "Starting..."
                      : appointment.status === "In Progress"
                        ? "Visit Started"
                        : "Start Visit"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <CaregiverAppointmentDetailsModal
        open={selectedAppointment !== null}
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">New Shift Offers</h2>

            <p className="text-sm text-gray-500">
              Review upcoming opportunities from partner organizations.
            </p>
          </div>

          <Building2 size={28} className="text-blue-600" />
        </div>

        <div className="space-y-4">
          {loadingOffers ? (
            <div className="rounded-xl border p-6 text-center text-gray-500">
              Loading shift offers...
            </div>
          ) : offers.length === 0 ? (
            <div className="rounded-xl border p-6 text-center text-gray-500">
              No shift offers available.
            </div>
          ) : (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="rounded-xl border p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3">
                      <UserCircle2
                        size={24}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {offer.patient_name}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${badgeColor(
                          offer.offer_status
                        )}`}
                      >
                        {offer.offer_status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {offer.organization_name || "Organization not specified"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>Start: {offer.start_date}</span>
                      <span>End: {offer.end_date || "Ongoing"}</span>
                      <span>Shift: {offer.shift}</span>
                    </div>

                    {offer.remarks && (
                      <p className="mt-3 text-sm text-slate-600">
                        {offer.remarks}
                      </p>
                    )}
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
              </div>
            ))
          )}
        </div>
      </Card>

      <CaregiverShiftOfferDetailsModal
        open={selectedOffer !== null}
        offer={selectedOffer}
        responding={selectedOffer !== null && respondingOfferId === selectedOffer.id}
        onClose={() => setSelectedOffer(null)}
        onAccept={async () => {
          if (!selectedOffer) return;
          const succeeded = await handleOfferResponse(
            selectedOffer.id,
            "Accepted"
          );
          if (succeeded) setSelectedOffer(null);
        }}
        onDecline={async () => {
          if (!selectedOffer) return;
          const succeeded = await handleOfferResponse(
            selectedOffer.id,
            "Declined"
          );
          if (succeeded) setSelectedOffer(null);
        }}
      />

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent Notifications</h2>

            <p className="text-sm text-gray-500">
              Stay updated with your latest activities.
            </p>
          </div>

          <Bell size={28} className="text-amber-500" />
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-xl border p-4 hover:bg-gray-50">
            <div className="rounded-full bg-blue-100 p-3">
              <ClipboardList size={22} className="text-blue-600" />
            </div>

            <div className="flex-1">
              <p className="font-semibold">New shift offer received</p>

              <p className="text-sm text-gray-500">
                Sunrise Care assigned you a new morning shift.
              </p>
            </div>

            <span className="text-xs text-gray-400">5 min ago</span>
          </div>

          <div className="flex items-start gap-4 rounded-xl border p-4 hover:bg-gray-50">
            <div className="rounded-full bg-green-100 p-3">
              <CalendarDays size={22} className="text-green-600" />
            </div>

            <div className="flex-1">
              <p className="font-semibold">Appointment Reminder</p>

              <p className="text-sm text-gray-500">
                Your next visit starts tomorrow at 8:00 AM.
              </p>
            </div>

            <span className="text-xs text-gray-400">1 hr ago</span>
          </div>

          <div className="flex items-start gap-4 rounded-xl border p-4 hover:bg-gray-50">
            <div className="rounded-full bg-purple-100 p-3">
              <CheckCircle size={22} className="text-purple-600" />
            </div>

            <div className="flex-1">
              <p className="font-semibold">Visit Approved</p>

              <p className="text-sm text-gray-500">
                Your latest visit report has been approved.
              </p>
            </div>

            <span className="text-xs text-gray-400">Yesterday</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Quick Actions</h2>

            <p className="text-sm text-gray-500">
              Frequently used shortcuts.
            </p>
          </div>

          <ArrowRight size={24} className="text-blue-600" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => navigate("/user/schedule")}
            className="flex items-center justify-between rounded-xl border p-5 transition hover:border-blue-500 hover:bg-blue-50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3">
                <CalendarDays size={24} className="text-blue-600" />
              </div>

              <div className="text-left">
                <h3 className="font-semibold">My Schedule</h3>

                <p className="text-sm text-gray-500">
                  View today's appointments
                </p>
              </div>
            </div>

            <ArrowRight />
          </button>

          <button
            onClick={() => navigate("/user/shifts")}
            className="flex items-center justify-between rounded-xl border p-5 transition hover:border-green-500 hover:bg-green-50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-green-100 p-3">
                <ClipboardList size={24} className="text-green-600" />
              </div>

              <div className="text-left">
                <h3 className="font-semibold">My Shifts</h3>

                <p className="text-sm text-gray-500">
                  Manage assigned shifts
                </p>
              </div>
            </div>

            <ArrowRight />
          </button>

          <button
            onClick={() => navigate("/user/availability")}
            className="flex items-center justify-between rounded-xl border p-5 transition hover:border-yellow-500 hover:bg-yellow-50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-yellow-100 p-3">
                <Clock size={24} className="text-yellow-600" />
              </div>

              <div className="text-left">
                <h3 className="font-semibold">Availability</h3>

                <p className="text-sm text-gray-500">
                  Update your working hours
                </p>
              </div>
            </div>

            <ArrowRight />
          </button>

          <button
            onClick={() => navigate("/user/offers")}
            className="flex items-center justify-between rounded-xl border p-5 transition hover:border-purple-500 hover:bg-purple-50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-100 p-3">
                <Bell size={24} className="text-purple-600" />
              </div>

              <div className="text-left">
                <h3 className="font-semibold">Shift Offers</h3>

                <p className="text-sm text-gray-500">
                  Review new opportunities
                </p>
              </div>
            </div>

            <ArrowRight />
          </button>
        </div>
      </Card>
    </div>
  );
}