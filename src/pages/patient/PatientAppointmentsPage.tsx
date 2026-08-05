import { useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
  MapPin,
} from "lucide-react";

import { Button, Card, EmptyState } from "../../components/ui";

interface PatientAppointment {
  id: number;
  date: string;
  time: string;
  service: string;
  caregiver: string;
  location: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export default function PatientAppointmentsPage() {
  const [filter, setFilter] = useState("All");

  const appointments: PatientAppointment[] = [
    {
      id: 1,
      date: "August 01, 2026",
      time: "9:00 AM - 12:00 PM",
      service: "Home Care Visit",
      caregiver: "John Reyes",
      location: "General Santos City",
      status: "Scheduled",
    },
    {
      id: 2,
      date: "August 05, 2026",
      time: "10:00 AM - 11:00 AM",
      service: "Medical Checkup",
      caregiver: "Maria Cruz",
      location: "General Santos City",
      status: "Scheduled",
    },
    {
      id: 3,
      date: "July 25, 2026",
      time: "8:00 AM - 11:00 AM",
      service: "Home Care Visit",
      caregiver: "John Reyes",
      location: "General Santos City",
      status: "Completed",
    },
  ];

  const filteredAppointments = appointments.filter(
    (appointment) =>
      filter === "All" || appointment.status === filter
  );

  const getStatusStyle = (
    status: PatientAppointment["status"]
  ) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700";

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
            "Scheduled",
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
      {filteredAppointments.length === 0 ? (
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
                  <Button variant="secondary">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}