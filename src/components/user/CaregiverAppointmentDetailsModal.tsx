import { Button, Modal } from "../../components/ui";

export interface CaregiverAppointment {
  id: number;
  patient_name: string;
  organization_name?: string | null;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  appointment_type: string;
  reason: string;
  location: string | null;
  status: string;
  notes: string | null;
}

interface CaregiverAppointmentDetailsModalProps {
  open: boolean;
  appointment: CaregiverAppointment | null;
  onClose: () => void;
}

export default function CaregiverAppointmentDetailsModal({
  open,
  appointment,
  onClose,
}: CaregiverAppointmentDetailsModalProps) {
  if (!appointment) return null;

  return (
    <Modal open={open} onClose={onClose} title="Appointment Details">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Patient</p>
            <p className="font-semibold text-slate-700">
              {appointment.patient_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Organization</p>
            <p className="font-semibold text-slate-700">
              {appointment.organization_name || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Date</p>
            <p className="font-semibold text-slate-700">
              {appointment.appointment_date}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Time</p>
            <p className="font-semibold text-slate-700">
              {appointment.appointment_time}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Duration</p>
            <p className="font-semibold text-slate-700">
              {appointment.duration} minutes
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Type</p>
            <p className="font-semibold text-slate-700">
              {appointment.appointment_type}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className="font-semibold text-slate-700">{appointment.status}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Location</p>
            <p className="font-semibold text-slate-700">
              {appointment.location || "Not specified"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500">Reason</p>
          <p className="mt-1 rounded-lg bg-slate-50 p-3 text-slate-700">
            {appointment.reason || "No reason provided."}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Notes</p>
          <p className="mt-1 rounded-lg bg-slate-50 p-3 text-slate-700">
            {appointment.notes || "No notes available."}
          </p>
        </div>

        <div className="flex justify-end border-t pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
