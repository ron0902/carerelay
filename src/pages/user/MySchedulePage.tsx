import { useEffect, useState } from "react";
import { Button, Card } from "../../components/ui";
import { CalendarDays, Clock, MapPin, UserCircle2 } from "lucide-react";
import { getTodaysSchedule } from "../../services/caregiverService";
import { startCaregiverVisit } from "../../services/caregiverService";
import { useAuth } from "../../context/AuthContext";
import CaregiverAppointmentDetailsModal, {
  type CaregiverAppointment,
} from "../../components/user/CaregiverAppointmentDetailsModal";

interface Schedule {
  id: number;
  patient: string;
  service: string;
  location: string;
  date: string;
  time: string;
  status:
    | "Pending"
    | "Approved"
    | "In Progress"
    | "Completed"
    | "Cancelled"
    | "Rejected";
  appointment: CaregiverAppointment;
}

export default function MySchedulePage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Schedule["status"]>(
    "All"
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<CaregiverAppointment | null>(null);

  useEffect(() => {
    loadSchedule();
  }, [user?.id]);

  const loadSchedule = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      const formatDate = (date: Date) => date.toISOString().slice(0, 10);
      const response = await getTodaysSchedule(
        user.id,
        formatDate(startDate),
        formatDate(endDate)
      );
      console.log("MY SCHEDULE API:", response);

      if (!response.success) {
        console.error(response.message);
        return;
      }

      const formattedSchedules: Schedule[] = (response.schedules || response.appointments || []).map(
        (item: any) => {
          const statusValue = String(item.status ?? "Active");
          const normalizedStatus: Schedule["status"] =
            statusValue === "Pending" ||
            statusValue === "Approved" ||
            statusValue === "In Progress" ||
            statusValue === "Completed" ||
            statusValue === "Cancelled" ||
            statusValue === "Rejected"
              ? (statusValue as Schedule["status"])
              : "Pending";

          const startDate = item.start_date || item.assigned_date || item.appointment_date || "";
          const shiftText = item.shift || item.appointment_time || "";

          const appointment: CaregiverAppointment = {
            id: Number(item.id),
            patient_name: item.patient_name ?? "Unknown Patient",
            organization_name: item.organization_name,
            appointment_date: item.appointment_date ?? startDate,
            appointment_time: item.appointment_time ?? shiftText,
            duration: Number(item.duration ?? 60),
            appointment_type: item.appointment_type ?? "Home Visit",
            reason: item.reason ?? "",
            location: item.location ?? item.organization_name ?? null,
            status: statusValue,
            notes: item.notes ?? null,
          };

          return {
            id: Number(item.id),
            patient: item.patient_name ?? "Unknown Patient",
            service: item.shift ?? item.appointment_type ?? "Care Visit",
            location: item.organization_name ?? item.location ?? "N/A",
            date: startDate || "Unscheduled",
            time:
              shiftText ||
              (item.end_date ? `${item.start_date} - ${item.end_date}` : startDate),
            status: normalizedStatus,
            appointment,
          };
        }
      );

      setSchedules(formattedSchedules);
    } catch (error) {
      console.error("Failed to load schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartVisit = async (schedule: Schedule) => {
    if (!user?.id) return;

    try {
      const response = await startCaregiverVisit(user.id, schedule.id);
      if (!response.success) {
        window.alert(response.message || "Unable to start visit.");
        return;
      }
      await loadSchedule();
    } catch (error) {
      console.error("Failed to start visit:", error);
      const apiError = error as {
        response?: { data?: { message?: string } };
      };
      window.alert(
        apiError.response?.data?.message || "Failed to start visit."
      );
    }
  };

  const badgeColor = (status: Schedule["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const query = search.toLowerCase();

    const matchesSearch =
      schedule.patient.toLowerCase().includes(query) ||
      schedule.service.toLowerCase().includes(query) ||
      schedule.location.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || schedule.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <p className="text-gray-500">
          Manage today's and upcoming home care visits.
        </p>
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Search patient, service, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border p-3"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "All" | Schedule["status"])
            }
            className="rounded-lg border p-3"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <Card>
          <p className="text-gray-500">Loading schedule...</p>
        </Card>
      ) : filteredSchedules.length === 0 ? (
        <Card>
          <p className="text-gray-500">No schedule items found.</p>
        </Card>
      ) : (
        filteredSchedules.map((schedule) => (
          <Card key={schedule.id} className="transition hover:shadow-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <div className="rounded-2xl bg-slate-100 p-3">
                  <UserCircle2 size={28} className="text-blue-600" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold">{schedule.patient}</h2>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${badgeColor(
                        schedule.status
                      )}`}
                    >
                      {schedule.status}
                    </span>
                  </div>

                  <p className="mt-2 font-medium text-slate-700">
                    {schedule.service}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {schedule.date}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {schedule.time}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {schedule.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                {schedule.status === "Pending" ||
                schedule.status === "Approved" ||
                schedule.status === "In Progress" ? (
                  <>
                    <Button size="sm" onClick={() => void handleStartVisit(schedule)}>
                      Start Visit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedAppointment(schedule.appointment)}
                    >
                      Patient Details
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedAppointment(schedule.appointment)}
                  >
                    View Details
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))
      )}

      <CaregiverAppointmentDetailsModal
        open={selectedAppointment !== null}
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}