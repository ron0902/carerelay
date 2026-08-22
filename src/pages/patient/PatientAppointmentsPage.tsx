import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
  MapPin,
} from "lucide-react";

import { Button, Card, EmptyState } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { getPatientAppointments } from "../../services/appointmentService";
import PatientVisitReportModal from "../../components/patient/PatientVisitReportModal";

interface PatientAppointment {
  id: number;
  date: string;
  time: string;
  service: string;
  caregiver: string;
  location: string;
  status: "Pending" | "Approved" | "In Progress" | "Completed" | "Cancelled" | "Rejected";
  notes: string | null;
}

export default function PatientAppointmentsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<PatientAppointment | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadAppointments = async () => {
      try {
        setLoading(true);
        const response = await getPatientAppointments(user.id);
        if (!response.success) {
          setAppointments([]);
          return;
        }

        setAppointments(
          (response.appointments || []).map((item: any) => ({
            id: Number(item.id),
            date: item.appointment_date ?? "",
            time: item.appointment_time ?? "",
            service: item.appointment_type ?? "Care Visit",
            caregiver: item.caregiver_name ?? "Not assigned",
            location: item.location ?? item.organization_name ?? "Not specified",
            status: item.status || "Pending",
            notes: item.notes ?? null,
          }))
        );
      } catch (error) {
        console.error("Failed to load patient appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    void loadAppointments();
  }, [user?.id]);

  const filteredAppointments = appointments.filter(
    (appointment) =>
      filter === "All" || appointment.status === filter
  );

  const getStatusStyle = (
    status: PatientAppointment["status"]
  ) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Approved":
        return "bg-blue-100 text-blue-700";

      case "In Progress":
        return "bg-indigo-100 text-indigo-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          My Appointments
        </h1>

        <p className="text-gray-500">
          View your upcoming and previous care visits.
        </p>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {[
            "All",
            "Pending",
            "Approved",
            "In Progress",
            "Completed",
            "Cancelled",
          ].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                filter === option
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </Card>

      {/* Appointment List */}
      {loading ? (
        <Card>
          <p className="text-gray-500">Loading appointments...</p>
        </Card>
      ) : filteredAppointments.length === 0 ? (
        <Card>
          <EmptyState
            title="No appointments found"
            description="You don't have any appointments in this category."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="overflow-hidden border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Appointment information */}
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <CalendarDays size={24} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {appointment.service}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {appointment.date}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2">
                        <Clock
                          size={16}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {appointment.time}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2">
                        <User
                          size={16}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {appointment.caregiver}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin
                          size={16}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0 lg:ml-4">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PatientVisitReportModal
        open={selectedAppointment !== null}
        notes={selectedAppointment?.notes ?? null}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}