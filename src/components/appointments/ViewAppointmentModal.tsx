import {
  CalendarDays,
  Clock,
  User,
  UserCog,
  Stethoscope,
  FileText,
} from "lucide-react";

import { Button, Modal } from "../../components/ui";
import { type Appointment } from "../../types/appointment";
import AppointmentStatusBadge from "./AppointmentStatusBadge";

interface ViewAppointmentModalProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

export default function ViewAppointmentModal({
  open,
  appointment,
  onClose,
}: ViewAppointmentModalProps) {
  if (!appointment) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Appointment Details"
    >
      <div className="space-y-6">

        <div className="grid grid-cols-2 gap-5">

          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <User size={16} />
              Patient
            </p>

            <p className="font-semibold">
              {appointment.patientName}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <UserCog size={16} />
              Caregiver
            </p>

            <p className="font-semibold">
              {appointment.caregiverName}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays size={16} />
              Appointment Date
            </p>

            <p className="font-semibold">
              {appointment.appointmentDate}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />
              Appointment Time
            </p>

            <p className="font-semibold">
              {appointment.appointmentTime}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <Stethoscope size={16} />
              Service
            </p>

            <p className="font-semibold">
              {appointment.service}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-500">
              Status
            </p>

            <AppointmentStatusBadge
              status={appointment.status}
            />
          </div>

        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <FileText size={16} />
            Notes
          </p>

          <div className="rounded-lg bg-gray-50 p-4">
            {appointment.notes || "No notes available."}
          </div>
        </div>

        <div className="flex justify-end border-t pt-5">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
}