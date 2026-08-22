import { useEffect, useState } from "react";
import { Button, Card } from "../../components/ui";
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  UserCircle2,
} from "lucide-react";
import VisitDetailsModal, {
  type CarePlan,
  type VisitShift,
} from "../../components/user/VisitDetailsModal";
import VisitChecklist from "../../components/user/VisitChecklist";
import VisitNotesModal from "../../components/user/VisitNotesModal";
import { useAuth } from "../../context/AuthContext";
import {
  completeCaregiverVisit,
  getMyShifts,
  getCaregiverCarePlan,
  startCaregiverVisit,
  type VisitReport,
} from "../../services/caregiverService";

export interface Shift {
  id: number;
  appointmentId: number | null;
  patientId: number | null;
  patient: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status:
    | "Pending"
    | "Approved"
    | "In Progress"
    | "Completed"
    | "Cancelled"
    | "Rejected"
    | "Active";
}

export default function MyShiftsPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Shift["status"]>(
    "All"
  );
  const [dateFilter, setDateFilter] = useState<"All" | string>("All");
  const [activeVisit, setActiveVisit] = useState<VisitShift | null>(null);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [visitNotesOpen, setVisitNotesOpen] = useState(false);
  const [visitChecklist, setVisitChecklist] = useState<Record<string, boolean>>({});
  const [submittingVisit, setSubmittingVisit] = useState(false);
  const [activeAppointmentId, setActiveAppointmentId] = useState<number | null>(null);
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [loadingCarePlan, setLoadingCarePlan] = useState(false);

  const loadMyShifts = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await getMyShifts(user.id);
      console.log(
        "MY SHIFTS API:",
        JSON.stringify(response, null, 2)
      );
      if (!response.success) {
        console.error(
          response.message
        );
        return;
      }
      const formattedShifts: Shift[] = (
        response.shifts || []
      ).map((assignment: any) => {
        let status: Shift["status"];
        const appointmentStatus = assignment.appointment_status;
        if (["Pending", "Approved", "In Progress", "Completed", "Cancelled", "Rejected"].includes(appointmentStatus)) {
          status = appointmentStatus as Shift["status"];
        } else if (assignment.status === "Active") {
          status = "Active";
        } else if (assignment.status === "Completed") {
          status = "Completed";
        } else {
          status = "Cancelled";
        }
        return {
          id: Number(assignment.id),
          appointmentId: assignment.appointment_id
            ? Number(assignment.appointment_id)
            : null,
          patientId: assignment.patient_id
            ? Number(assignment.patient_id)
            : null,
          patient:
            assignment.patient_name ?? "",
          service:
            "Care Assignment",
          date:
            assignment.start_date ?? "",
          time:
            assignment.shift ?? "",
          location:
            assignment.organization_name ??
            "Location not specified",
          status,
        };
      });
      setShifts(formattedShifts);
    } catch (error) {
      console.error(
        "My shifts error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    loadMyShifts();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !activeVisit?.patientId || !visitModalOpen) return;

    const loadCarePlan = async () => {
      try {
        setLoadingCarePlan(true);
        const response = await getCaregiverCarePlan(
          user.id,
          activeVisit.patientId as number,
          activeVisit.date
        );
        setCarePlan(response.success ? response.care_plan ?? null : null);
      } catch (error) {
        console.error("Failed to load care plan:", error);
        setCarePlan(null);
      } finally {
        setLoadingCarePlan(false);
      }
    };

    void loadCarePlan();
  }, [activeVisit?.patientId, user?.id, visitModalOpen]);

  const badgeColor = (status: Shift["status"]) => {
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

  const filteredShifts = shifts.filter((shift) => {
    const query = search.toLowerCase();
    const matchesSearch =
      shift.patient.toLowerCase().includes(query) ||
      shift.service.toLowerCase().includes(query) ||
      shift.location.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "All" || shift.status === statusFilter;
    const matchesDate = dateFilter === "All" || shift.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const availableDates = Array.from(new Set(shifts.map((shift) => shift.date)));

  const openVisitDetails = (shift: Shift) => {
    setActiveAppointmentId(shift.appointmentId);
    setActiveVisit({
      id: shift.appointmentId ?? shift.id,
      patientId: shift.patientId,
      patient: shift.patient,
      service: shift.service,
      date: shift.date,
      time: shift.time,
      location: shift.location,
      status: shift.status,
    });
    setVisitModalOpen(true);
  };

  const handleStartVisit = (shift: Shift) => {
    setActiveAppointmentId(shift.appointmentId);
    setActiveVisit({
      id: shift.appointmentId ?? shift.id,
      patientId: shift.patientId,
      patient: shift.patient,
      service: shift.service,
      date: shift.date,
      time: shift.time,
      location: shift.location,
      status: shift.status,
    });
    setVisitModalOpen(true);
  };

  const handleStartChecklist = async () => {
    if (!user?.id || !activeAppointmentId) {
      window.alert("This shift has no appointment available to start.");
      return;
    }

    try {
      const response = await startCaregiverVisit(user.id, activeAppointmentId);
      if (!response.success) {
        window.alert(response.message || "Unable to start visit.");
        return;
      }

      setVisitModalOpen(false);
      setShowChecklist(true);
      await loadMyShifts();
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Shifts</h1>
        <p className="text-gray-500">
          View and manage all assigned shifts.
        </p>
      </div>

      <Card>
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr,1fr]">
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shifts..."
              className="w-full border-none bg-transparent outline-none"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | Shift["status"])}
            className="rounded-lg border border-slate-200 p-3"
          >
            <option value="All">Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-slate-200 p-3"
          >
            <option value="All">Date</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading your shifts...
          </div>
        ) : filteredShifts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No assigned shifts found.
          </div>
        ) : (
          <>
            <div className="space-y-3 p-2 lg:p-0">
              {filteredShifts.map((shift) => (
            <div
              key={shift.id}
              className="rounded-xl border border-slate-200 p-4 transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-3">
                  <div className="rounded-2xl bg-slate-100 p-3">
                    <UserCircle2 size={28} className="text-blue-600" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold">{shift.patient}</h2>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${badgeColor(
                          shift.status
                        )}`}
                      >
                        {shift.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-600">{shift.service}</p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {shift.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {shift.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {shift.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {shift.status === "Pending" ||
                  shift.status === "Approved" ||
                  shift.status === "In Progress" ? (
                    <>
                      <Button size="sm" onClick={() => handleStartVisit(shift)}>
                        Start Visit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openVisitDetails(shift)}
                      >
                        View Details
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openVisitDetails(shift)}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
            </div>
          </>
        )}
      </Card>

      <VisitDetailsModal
        open={visitModalOpen}
        shift={activeVisit}
        carePlan={carePlan}
        loadingCarePlan={loadingCarePlan}
        onClose={() => {
          setVisitModalOpen(false);
          setActiveVisit(null);
          setActiveAppointmentId(null);
        }}
        onStartChecklist={() => void handleStartChecklist()}
      />

      {showChecklist && (
        <VisitChecklist
          onComplete={(checklist) => {
            setVisitChecklist(checklist);
            setShowChecklist(false);
            setVisitNotesOpen(true);
          }}
        />
      )}

      <VisitNotesModal
        open={visitNotesOpen}
        checklist={visitChecklist}
        onClose={() => setVisitNotesOpen(false)}
        submitting={submittingVisit}
        onSubmit={async (report: VisitReport) => {
          if (!user?.id || !activeVisit) return;

          try {
            setSubmittingVisit(true);
            const response = await completeCaregiverVisit(
              user.id,
              activeVisit.id,
              report
            );

            if (!response.success) {
              window.alert(response.message || "Unable to submit visit.");
              return;
            }

            setShifts((prev) =>
              prev.map((shift) =>
                shift.id === activeVisit.id
                  ? { ...shift, status: "Completed" }
                  : shift
              )
            );
            setVisitNotesOpen(false);
            setActiveVisit(null);
            setActiveAppointmentId(null);
            await loadMyShifts();
          } catch (error) {
            console.error("Failed to complete visit:", error);
            window.alert("Failed to submit visit.");
          } finally {
            setSubmittingVisit(false);
          }
        }}
      />
    </div>
  );
}