import { useState } from "react";
import { Button, Card } from "../../components/ui";
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  UserCircle2,
} from "lucide-react";
import VisitDetailsModal, {
  type VisitShift,
} from "../../components/user/VisitDetailsModal";
import VisitChecklist from "../../components/user/VisitChecklist";
import VisitNotesModal from "../../components/user/VisitNotesModal";

export interface Shift {
  id: number;
  patient: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: "Upcoming" | "Active" | "Completed" | "Cancelled";
}

export default function MyShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: 1,
      patient: "Maria Santos",
      service: "Home Care Visit",
      date: "July 28, 2026",
      time: "8:00 AM - 12:00 PM",
      location: "General Santos City",
      status: "Active",
    },
    {
      id: 2,
      patient: "Juan Dela Cruz",
      service: "Medication Assistance",
      date: "July 29, 2026",
      time: "1:00 PM - 5:00 PM",
      location: "Koronadal City",
      status: "Upcoming",
    },
    {
      id: 3,
      patient: "Ana Ramos",
      service: "Companionship Care",
      date: "July 30, 2026",
      time: "8:00 AM - 4:00 PM",
      location: "Polomolok",
      status: "Completed",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Shift["status"]>(
    "All"
  );
  const [dateFilter, setDateFilter] = useState<"All" | string>("All");
  const [activeVisit, setActiveVisit] = useState<VisitShift | null>(null);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [visitNotesOpen, setVisitNotesOpen] = useState(false);

  const badgeColor = (status: Shift["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-700";
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
    setActiveVisit({
      id: shift.id,
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
    setActiveVisit({
      id: shift.id,
      patient: shift.patient,
      service: shift.service,
      date: shift.date,
      time: shift.time,
      location: shift.location,
      status: shift.status,
    });
    setVisitModalOpen(true);
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
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
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
        <div className="hidden lg:grid lg:grid-cols-[1.6fr,1fr,1fr,0.8fr] lg:gap-4 lg:border-b lg:px-4 lg:py-3 lg:text-sm lg:font-semibold lg:text-slate-600">
          <div>Patient</div>
          <div>Date</div>
          <div>Time</div>
          <div>Status</div>
        </div>

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
                  {shift.status === "Active" ? (
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
      </Card>

      <VisitDetailsModal
        open={visitModalOpen}
        shift={activeVisit}
        onClose={() => {
          setVisitModalOpen(false);
          setActiveVisit(null);
        }}
        onStartChecklist={() => {
          setVisitModalOpen(false);
          setShowChecklist(true);
        }}
      />

      {showChecklist && (
        <VisitChecklist
          onComplete={() => {
            setShowChecklist(false);
            setVisitNotesOpen(true);
          }}
        />
      )}

      <VisitNotesModal
        open={visitNotesOpen}
        onClose={() => setVisitNotesOpen(false)}
        onSubmit={() => {
          setVisitNotesOpen(false);

          if (activeVisit) {
            setShifts((prev) =>
              prev.map((shift) =>
                shift.id === activeVisit.id
                  ? {
                      ...shift,
                      status: "Completed",
                    }
                  : shift
              )
            );
          }

          setActiveVisit(null);
        }}
      />
    </div>
  );
}