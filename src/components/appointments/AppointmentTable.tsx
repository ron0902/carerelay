import {
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Clock,
} from "lucide-react";

import { type Appointment } from "../../types/appointment";
import AppointmentStatusBadge from "./AppointmentStatusBadge";

interface AppointmentTableProps {
  appointments: Appointment[];
  onView: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
}

export default function AppointmentTable({
  appointments,
  onView,
  onEdit,
  onDelete,
}: AppointmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">

        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-4 text-left">Patient</th>
            <th className="p-4 text-left">Caregiver</th>
            <th className="p-4 text-left">Schedule</th>
            <th className="p-4 text-left">Service</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr
              key={appointment.id}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-4">
                <div className="font-medium">
                  {appointment.patientName}
                </div>
              </td>

              <td className="p-4">
                {appointment.caregiverName}
              </td>

              <td className="p-4">
                <div className="flex items-center gap-2 text-sm">

                  <CalendarDays
                    size={16}
                    className="text-blue-600"
                  />

                  {appointment.appointmentDate}

                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">

                  <Clock size={15} />

                  {appointment.appointmentTime}

                </div>
              </td>

              <td className="p-4">
                {appointment.service}
              </td>

              <td className="p-4">
                <AppointmentStatusBadge
                  status={appointment.status}
                />
              </td>

              <td className="p-4">
                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onView(appointment)}
                    className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(appointment)}
                    className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(appointment)}
                    className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}