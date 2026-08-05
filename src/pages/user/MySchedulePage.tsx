import { useState } from "react";
import { Button, Card } from "../../components/ui";
import { CalendarDays, Clock, MapPin, UserCircle2 } from "lucide-react";

interface Schedule {
  id: number;
  patient: string;
  service: string;
  location: string;
  date: string;
  time: string;
  status: "Active" | "Upcoming" | "Completed" | "Cancelled";
}

export default function MySchedulePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Schedule["status"]>(
    "All"
  );

  const schedules: Schedule[] = [
    {
      id: 1,
      patient: "Maria Santos",
      service: "Home Care Visit",
      location: "General Santos City",
      date: "Today",
      time: "8:00 AM - 12:00 PM",
      status: "Active",
    },
    {
      id: 2,
      patient: "Juan Dela Cruz",
      service: "Medication Assistance",
      location: "Koronadal City",
      date: "Today",
      time: "1:00 PM - 5:00 PM",
      status: "Upcoming",
    },
    {
      id: 3,
      patient: "Ana Reyes",
      service: "Companionship Care",
      location: "Polomolok",
      date: "Yesterday",
      time: "9:00 AM - 11:00 AM",
      status: "Completed",
    },
    {
      id: 4,
      patient: "Liza Domingo",
      service: "Post-Surgery Checkup",
      location: "Tupi",
      date: "Today",
      time: "3:00 PM - 4:00 PM",
      status: "Cancelled",
    },
  ];

  const badgeColor = (status: Schedule["status"]) => {
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
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {filteredSchedules.map((schedule) => (
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
              {schedule.status === "Active" ? (
                <>
                  <Button size="sm">Start Visit</Button>
                  <Button variant="secondary" size="sm">
                    Patient Details
                  </Button>
                </>
              ) : (
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}